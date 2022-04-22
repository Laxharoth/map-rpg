import { CharacterEquipment } from './Inventory/CharacterEquipment';
import { MasterService } from "src/app/service/master.service";
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { Perk } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";
import { Status } from "src/gameLogic/custom/Class/Status/Status";
import { statustype } from "src/gameLogic/custom/Class/Status/Status.type";
import { StatusBattle } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { TimedStatus } from "src/gameLogic/custom/Class/Status/TimedStatus";
import { tag as tagnames } from "src/gameLogic/custom/customTypes/tags";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory";
import { pushBattleActionOutput, removeItem } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { ObjectSet } from "../../ClassHelper/ObjectSet";
import { AttackCommand, DefendCommand, ShootCommand, tryAttack } from "../Battle/Battle.functions";
import { BattleCommand, EmptyCommand, ITEM_PRIORITY } from "../Battle/BattleCommand";
import { BattleClassOptions, CharacterBattleClass } from "../CharacterBattleClass/CharacterBattleClass";
import { EnergyStats, ActionOutput, FullCoreStats, LevelStats, FullCalculatedStats, FullResistanceStats } from "./Character.type";
import { Inventory } from "./Inventory/Inventory";
import { Reaction } from "./Reaction/Reaction";
import { Storeable } from 'src/gameLogic/core/Factory/Factory';
import { CharacterBattleClassFactory } from '../../Factory/CharacterBattleClassFactory';
import { Int, roundToInt } from '../../ClassHelper/Int';
import { applyModifiers } from './StatsModifier';

/** A model of a character. */
export abstract class Character implements Storeable
{
  levelStats:LevelStats;
  currentEnergyStats:EnergyStats;
  /* The original stats of the character. */
  coreStats:FullCoreStats;
  originalResistance:FullResistanceStats;
  /* The current status of the character after appling equipment during a battle round. */
  calculatedStats:FullCalculatedStats;
  calculatedResistance:FullResistanceStats;
  gold:number = 0;

  protected perks:ObjectSet<Perk> = new ObjectSet<Perk>();
  protected status = new ObjectSet<Status>();
  protected timedStatus = new ObjectSet<TimedStatus>();
  protected battleStatus = new ObjectSet<StatusBattle>();
  protected characterBattleClass:CharacterBattleClass;
  get battleClass():CharacterBattleClass { return this.characterBattleClass;}
  protected abstract _name:string;
  abstract readonly type:characterType;
  inventory:Inventory;
  characterEquipment:CharacterEquipment;
  get name(): string{ return this._name};
  protected readonly masterService:MasterService
  private _bypassScene = false;
  constructor(masterService:MasterService, characterBattleClass:string|null=null){
    this.characterBattleClass=CharacterBattleClassFactory(masterService,{
      Factory:'CharacterBattleClass',
      type:characterBattleClass||'CharacterBattleClassEmpty'
    })
    this.inventory = new Inventory(masterService);
    this.characterEquipment = new CharacterEquipment(masterService);
    this.masterService = masterService;
    this.levelStats = {experience:0 as Int, upgradePoint:0 as Int, perkPoint:0 as Int, level:0 as Int, upgradePath:[]}
    this.coreStats = {...this.characterBattleClass.initialPhysicStats};
    this.originalResistance = {...this.characterBattleClass.initialResistanceStats};
    // @ts-ignore
    this.calculatedStats = {};
    // @ts-ignore
    this.calculatedResistance = {};
    this.calculateStats();
    this.currentEnergyStats = {
      hitpoints: this.calculatedStats.hitpoints,
      energypoints:this.calculatedStats.energypoints};
    this.applyStatus();
  }
  /** Uses the meleeWeapon to attack the target. */
  Attack(targets:Character[]):BattleCommand{return AttackCommand(this,targets)}
  /** Uses rangedWeapon to attack the target. */
  Shoot(targets:Character[]):BattleCommand{return ShootCommand(this,targets)}
  /** Uses shield .defend */
  Defend(target:Character[]):BattleCommand{return DefendCommand(this,target)}
  unequipMelee(){this.characterEquipment.unequipMelee(this)}
  unequipRanged(){this.characterEquipment.unequipRanged(this)}
  unequipArmor(){this.characterEquipment.unequipArmor(this)}
  unequipShield(){this.characterEquipment.unequipShield(this)}
  /** Reset roundStats apply the battle status effects and cooldown the specials. */
  startRound():BattleCommand[]{
    const commands:BattleCommand[] = [];
    commands.push(...this.startRoundApplyStatus())
    commands.push({source:this,target:[this],tags:[],excecute:()=>[[],[this.currentStatusString]]});
    this.cooldownSpecials();
    this.calculateStats()
    return commands;
  }
  /** Removes the battle status. */
  onDefeated():ActionOutput{
    const description:ActionOutput =[[],[]]
    for(const status of this.battleStatus)
    { pushBattleActionOutput(status.onStatusRemoved(this),description) }
    this.battleStatus.clear()
    return description;
  }
  /** Gets the number of instances of a specific status in the character */
  hasStatus(status:Status|statustype):number{
    let timesFound = 0;
    for(const characterStatus of this.iterStatus())
      if(compareStatusName(status, characterStatus))
        timesFound++;
    return timesFound;
  }
  /** Gets all the specials from equipments, perks and status. */
  get specialAttacks(): ObjectSet<SpecialAttack>{
    const specials= new ObjectSet<SpecialAttack>()
    for(const equipment of this.characterEquipment) { specials.push(...equipment.specials) }
    for(const perk of this.perks) { specials.push(...perk.specials) }
    for(const status of this.iterStatus()) { specials.push(...status.specials) }
    return specials
  };
  /** Checks if the character has a tag. */
  hasTag(tag:tagnames):boolean { return this.tags.includes(tag); }
  /** TODO add description */
  isDefeated():boolean{return this.currentEnergyStats.hitpoints<=0}
  /** Adds status to the character. to the correct Array if able. */
  addStatus(status: Status): ActionOutput{
    if(!status)return [[],[]];
    if(!status.canApply(this))return [[], [`${this.name} resisted ${status.name}`]];
    if(status instanceof StatusBattle) this.battleStatus.push(status);
    else if(status instanceof TimedStatus) this.timedStatus.push(status);
    else this.status.push(status);
    return status.onStatusGainded(this)
  }
  /** Adds perk if does not already has it. */
  addPerk(perk:Perk):void { this.perks.push(perk); }
  /** Returns a perk if the character has it. */
  getPerk(perkOrName:Perk|perkname):Perk|null{
    if(perkOrName instanceof Perk){ return this.perks.get(perkOrName.hash())||null; }
    for(const perk of this.perks)if(perk.name === perkOrName)return perk;
    return null;
  }
  /** Removes all instances of the given statusname or Status. */
  removeStatus(status:Status|statustype):ActionOutput{
    const removeStatusDescription:ActionOutput = [[],[]];
    pushBattleActionOutput(this._removeStatus(status,this.battleStatus),removeStatusDescription);
    pushBattleActionOutput(this._removeStatus(status,this.timedStatus),removeStatusDescription);
    pushBattleActionOutput(this._removeStatus(status,this.status),removeStatusDescription);
    this.calculateStats();
    return removeStatusDescription;
  }
  /** Gets the first instance of Status that matches the statusname or type of Status */
  getStatus(status: statustype):Status|null{
    for(const characterStatus of this.iterStatus())if(compareStatusName(status, characterStatus))return characterStatus;
    return null;
  }
  useItem(item: GameItem | SpecialAttack, targets: Character[]): BattleCommand {
    if (item instanceof SpecialAttack) return this._useSpecialAttack(item, targets);
    if (item instanceof GameItem){
      return {
        source: this,
        target: targets,
        tags: item.tags,
        excecute: () => this.inventory.useItem(item, this, targets),
        priority:ITEM_PRIORITY
      }
    }
    console.warn('item not in inventory')
    return new EmptyCommand(this, targets)
  }
  /** Iterator of character status. */
  *iterStatus():Generator<Status, void,unknown>{
    for(const status of this.status) yield status;
    for(const status of this.timedStatus) yield status;
    for(const status of this.battleStatus) yield status;
  }
  /**
   * Checks all the reactions of the character.
   * Won't react if character is paralized, zero hitpoints or the battle ended.
   */
  react(action:BattleCommand):ActionOutput{
    if( this.currentEnergyStats.hitpoints<=0  || this._bypassScene )return [[],[]];
    return this.reactions.reduce(
        (scenes, reaction)=>pushBattleActionOutput(reaction.reaction(this,action),scenes)
        ,[[],[]] as ActionOutput
      );
  }
  reactBefore(action:BattleCommand):ActionOutput{
    action.tags.push('before-action');
    if( this.currentEnergyStats.hitpoints<=0  || this._bypassScene )return [[],[]];
    const t = this.reactions.reduce(
        (scenes, reaction)=>pushBattleActionOutput(reaction.reaction(this,action),scenes)
        ,[[],[]] as ActionOutput
      );
    action.tags.pop();
    return t;
  }
  /** Reduces the character hitpoints up to zero. */
  takeDamage(damage:number):number{
    const hitpointsBeforeDamage = this.currentEnergyStats.hitpoints;
    this.currentEnergyStats.hitpoints=roundToInt(Math.max(0,this.currentEnergyStats.hitpoints-damage));
    return this.currentEnergyStats.hitpoints-hitpointsBeforeDamage;
  }
  /** Heals hitpoints from the character up to original hitpoints. */
  healHitPoints(hitpointsgain:number):number{
    const hitpointsBeforeHeal = this.currentEnergyStats.hitpoints;
    this.currentEnergyStats.hitpoints=roundToInt(
      Math.min(this.calculatedStats.hitpoints,this.currentEnergyStats.hitpoints+hitpointsgain));
    return this.currentEnergyStats.hitpoints-hitpointsBeforeHeal;
  }
  gainExperience(experience:number):number {
    this.levelStats.experience=roundToInt(this.levelStats.experience+experience);
    return experience;
  }
  /** Gets the current status of the character. */
  get currentStatusString():string { return `${this.name} looks like they are ${this.currentEnergyStats.hitpoints} in a scale of 0 to ${this.calculatedStats.hitpoints}`}
  /** Removes all the Battle Status without trigger reactions. */
  onEndBattle():void{
    const removeStatus = this.battleStatus
    this.battleStatus.clear();
    this._bypassScene = true;
    for(const status of removeStatus)status.onStatusRemoved(this);
    this._bypassScene = false;
  }
  /** Gets all the reactions from equipment, perks and status. */
  protected get reactions(): Reaction[]{
    const reactions = new ObjectSet<Reaction>()
    for(const equipment of this.characterEquipment) { reactions.push(...equipment.reactions) }
    for(const perk of this.perks){reactions.push(...perk.reactions)}
    for(const status of this.iterStatus()){reactions.push(...status.reactions)}
    return reactions;
  };
  /** Gets all the tags from equipment, perks and status. */
  protected get tags():tagnames[]{
    const tags:tagnames[] = [];
    for(const equipment of this.characterEquipment) tags.push(...equipment.tags)
    for(const status of this.iterStatus())tags.push(...status.tags)
    for(const perk of this.perks)tags.push(...perk.tags)
    return tags;
  }
  /** Apply the Battle Status effects. */
  protected startRoundApplyStatus():BattleCommand[]{
    return [...this.battleStatus].map(status=>status.applyEffect(this));
  }
  /** Cooldown the SpecialAttacks */
  protected cooldownSpecials():void { for(const special of this.specialAttacks) special.cool() }
  calculateStats():void {
    this.calculatedStats = this.characterBattleClass.calculate_stats(this.coreStats);
    this.calculatedResistance = {...this.originalResistance};
    for(const equipment of this.characterEquipment){ applyModifiers(this,equipment); }
    for(const status of this.iterStatus()){ applyModifiers(this,status); }
  }
  /** Apply status effects. */
  protected applyStatus():void { for(const status of this.iterStatus()){ status.applyEffect(this); } }
  /** TODO */
  private _removeStatus(status: string | Status, statusArray:Status[]): ActionOutput{
    if(status instanceof Status){
      if(removeItem(statusArray, status)) return status.onStatusRemoved(this);
      return [[],[]]
    }
    return this.remove_status_from_name(status,statusArray);
  }
  private remove_status_from_name(status: string,statusArray:Status[]) {
    let removeStatusDescription: ActionOutput = [[], []];
    let statusIndex = statusArray.findIndex(characterStatus => (status === characterStatus.name));
    while (statusIndex >= 0) {
      const [statusRemoved] = statusArray.splice(statusIndex, 1);
      removeStatusDescription = statusRemoved.onStatusRemoved(this);
      statusIndex = statusArray.findIndex(characterStatus => (status === characterStatus.name));
    }
    return removeStatusDescription;
  }
  /** Use a special attack from the equpments, perks or status. */
  private _useSpecialAttack(item: SpecialAttack,targets: Character[]):BattleCommand{
    if(this.specialAttacks.has(item.hash()))
      return {
        source:this, target:targets, tags:item.tags,
        excecute:()=>{
          if(item.isSingleTarget)return tryAttack(this,targets[0],(target: Character)=>item.itemEffect(this,target))
          return targets.reduce( (descriptions:ActionOutput,target)=>pushBattleActionOutput(
            item.itemEffect(this,target),descriptions),[[],[]] )
        }
      }
    return new EmptyCommand(this,targets);
  }
  /** The automatic action to perform. */
  IA_Action():BattleCommand{
    return this._IA_Action(this.allys,this.enemies);
  }
  /** The logic behind the action. */
  protected abstract _IA_Action(ally: Character[], enemy: Character[]):BattleCommand;
  toJson(): CharacterStoreable { return { Factory:"Character",type:this.type,battle_class:this.battleClass.toJson()} }
  fromJson(options: CharacterStoreable): void {
    if(options.battle_class)
      this.characterBattleClass=CharacterBattleClassFactory(this.masterService,options.battle_class)
  }
  get allys():Character[]{
    if((this.masterService.partyHandler.enemyFormation.enemies as Character[]).some(char=>char===this)){
      return this.masterService.partyHandler.enemyParty;
    }
    return this.masterService.partyHandler.userParty;
  }
  get enemies():Character[]{
    if((this.masterService.partyHandler.enemyFormation.enemies as Character[]).some(char=>char===this)){
      return this.masterService.partyHandler.userParty;
    }
    return this.masterService.partyHandler.enemyParty;
  }
}
export interface CharacterStoreable{
  Factory: "Character"; type: characterType;
  battle_class?:BattleClassOptions,[key: string]:any;
}
/** Check if the statusname is the same as the second argument. */
function compareStatusName(status: string | Status, characterStatus: Status):boolean{
  return (status instanceof Status && status.constructor === characterStatus.constructor) ||
    characterStatus.type === status;
}
