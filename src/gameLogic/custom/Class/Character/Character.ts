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
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory";
import { pushBattleActionOutput, removeItem } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { ObjectSet } from "../../ClassHelper/ObjectSet";
import { AttackCommand, DefendCommand, ShootCommand, tryAttack } from "../Battle/Battle.functions";
import { BattleCommand, EmptyCommand, ITEM_PRIORITY } from "../Battle/BattleCommand";
import { BattleClassOptions, CharacterBattleClass } from "../CharacterBattleClass/CharacterBattleClass";
import { EnergyStats, CoreStats, ResistanceStats, ActionOutput, FullCoreStats, LevelStats, FullCalculatedStats, FullResistanceStats } from "./Character.type";
import { Inventory } from "./Inventory/Inventory";
import { Reaction } from "./Reaction/Reaction";
import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { CharacterBattleClassFactory } from '../../Factory/CharacterBattleClassFactory';

/** A model of a character. */
export abstract class Character implements storeable
{
  level_stats:LevelStats;
  current_energy_stats:EnergyStats;
  /* The original stats of the character. */
  core_stats:CoreStats;
  original_resistance:ResistanceStats;
  /* The current status of the character after appling equipment during a battle round. */
  calculated_stats:FullCalculatedStats;
  calculated_resistance:FullResistanceStats;
  gold:number = 0;

  protected perks:ObjectSet<Perk> = new ObjectSet<Perk>();
  protected status = new ObjectSet<Status>();
  protected timed_status = new ObjectSet<TimedStatus>();
  protected battle_status = new ObjectSet<StatusBattle>();
  protected character_battle_class:CharacterBattleClass;
  get battle_class():CharacterBattleClass { return this.character_battle_class;}
  protected abstract _name:string;
  abstract readonly type:characterType;
  inventory:Inventory;
  character_equipment:CharacterEquipment;
  get name(): string{ return this._name};
  protected readonly masterService:MasterService
  private __bypass_scene__ = false;
  constructor(masterService:MasterService, character_battle_class:string=null)
  {
    this.character_battle_class=CharacterBattleClassFactory(masterService,{Factory:'CharacterBattleClass',type:character_battle_class||'CharacterBattleClassEmpty'})
    this.inventory = new Inventory(masterService);
    this.character_equipment = new CharacterEquipment(masterService);
    this.masterService = masterService;
    this.level_stats = {experience:0, upgrade_point:0, perk_point:0, level:0, upgrade_path:[]}
    this.core_stats = {...this.character_battle_class.initial_physic_stats};
    this.original_resistance = {...this.character_battle_class.initial_resistance_stats};
    this.calculateStats();
    this.current_energy_stats = { hitpoints: this.calculated_stats.hitpoints, energypoints:this.calculated_stats.energypoints};
    this.applyStatus();
  }
  /** Uses the meleeWeapon to attack the target. */
  Attack(targets:Character[]):BattleCommand{return AttackCommand(this,targets)}
  /** Uses rangedWeapon to attack the target. */
  Shoot(targets:Character[]):BattleCommand{return ShootCommand(this,targets)}
  /** Uses shield .defend */
  Defend(target:Character[]):BattleCommand{return DefendCommand(this,target)}
  unequipMelee(){this.character_equipment.unequipMelee(this)}
  unequipRanged(){this.character_equipment.unequipRanged(this)}
  unequipArmor(){this.character_equipment.unequipArmor(this)}
  unequipShield(){this.character_equipment.unequipShield(this)}
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
    let description:ActionOutput =[[],[]]
    for(const status of this.battle_status)
    { pushBattleActionOutput(status.onStatusRemoved(this),description) }
    this.battle_status.clear()
    return description;
  }
  /** Gets the number of instances of a specific status in the character */
  hasStatus(status:Status|statustype):number
  {
    let timesFound = 0;
    for(const characterStatus of this.iterStatus())
      if(compareStatusName(status, characterStatus))
        timesFound++;
    return timesFound;
  }
  /** Gets all the specials from equipments, perks and status. */
  get specialAttacks(): ObjectSet<SpecialAttack>
  {
    const specials= new ObjectSet<SpecialAttack>()
    for(const equipment of this.character_equipment) { specials.push(...equipment.specials) }
    for(const perk of this.perks) { specials.push(...perk.specials) }
    for(const status of this.iterStatus()) { specials.push(...status.specials) }
    return specials
  };
  /** Checks if the character has a tag. */
  hasTag(tag:tag):boolean { return this.tags.includes(tag); }
  /** TODO add description */
  is_defeated():boolean{return this.current_energy_stats.hitpoints<=0}
  /** Adds status to the character. to the correct Array if able. */
  addStatus(status: Status): ActionOutput{
    if(!status)return [[],[]];
    if(!status.canApply(this))return [[], [`${this.name} resisted ${status.name}`]];
    if(status instanceof StatusBattle) this.battle_status.push(status);
    else if(status instanceof TimedStatus) this.timed_status.push(status);
    else this.status.push(status);
    return status.onStatusGainded(this)
  }
  /** Adds perk if does not already has it. */
  addPerk(perk:Perk):void { this.perks.push(perk); }
  /** Returns a perk if the character has it. */
  getPerk(perkOrName:Perk|perkname):Perk
  {
    if(perkOrName instanceof Perk)return this.perks.get(perkOrName.hash());
    for(const perk of this.perks)if(perk.name === perkOrName)return perk;
    return null;
  }
  /** Removes all instances of the given statusname or Status. */
  removeStatus(status:Status|statustype):ActionOutput
  {
    let removeStatusDescription:ActionOutput = [[],[]];
    pushBattleActionOutput(this._removeStatus(status,this.battle_status),removeStatusDescription);
    pushBattleActionOutput(this._removeStatus(status,this.timed_status),removeStatusDescription);
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
    if (item instanceof GameItem)
    {
      return {
        source: this,
        target: targets,
        tags: ['item-use'],
        excecute: () => this.inventory.useItem(item, this, targets),
        priority:ITEM_PRIORITY
      }
    }
    console.warn('item not in inventory')
    return new EmptyCommand(this, targets)
  }
  /** Iterator of character status. */
  iterStatus    = function*():Generator<Status, void,unknown>
                  {
                    for(const status of this.status) yield status;
                    for(const status of this.timed_status) yield status;
                    for(const status of this.battle_status) yield status;
                  }
  /**
   * Checks all the reactions of the character.
   * Won't react if character is paralized, zero hitpoints or the battle ended.
   */
  react(action:BattleCommand):ActionOutput
  {
    if( this.current_energy_stats.hitpoints<=0  || this.__bypass_scene__ )return [[],[]];
    return this.reactions.reduce(
        (scenes, reaction)=>pushBattleActionOutput(reaction.reaction(this,action),scenes)
        ,[[],[]] as ActionOutput
      );
  }
  reactBefore(action:BattleCommand):ActionOutput{
    action.tags.push('before-action');
    if( this.current_energy_stats.hitpoints<=0  || this.__bypass_scene__ )return [[],[]];
    const t = this.reactions.reduce(
        (scenes, reaction)=>pushBattleActionOutput(reaction.reaction(this,action),scenes)
        ,[[],[]] as ActionOutput
      );
    action.tags.pop();
    return t;
  }
  /** Reduces the character hitpoints up to zero. */
  takeDamage(damage:number):number
  {
    const hitpointsBeforeDamage = this.current_energy_stats.hitpoints;
    this.current_energy_stats.hitpoints=Math.max(0,this.current_energy_stats.hitpoints-damage);
    return this.current_energy_stats.hitpoints-hitpointsBeforeDamage;
  }
  /** Heals hitpoints from the character up to original hitpoints. */
  healHitPoints(hitpointsgain:number):number
  {
    const hitpointsBeforeHeal = this.current_energy_stats.hitpoints;
    this.current_energy_stats.hitpoints=Math.min(this.calculated_stats.hitpoints,this.current_energy_stats.hitpoints+hitpointsgain);
    return this.current_energy_stats.hitpoints-hitpointsBeforeHeal;
  }
  gain_experience(experience:number):number {
    this.level_stats.experience+=experience;
    return experience;
  }
  /** Gets the current status of the character. */
  get currentStatusString():string { return `${this.name} looks like they are ${this.current_energy_stats.hitpoints} in a scale of 0 to ${this.calculated_stats.hitpoints}`}
  /** Removes all the Battle Status without trigger reactions. */
  onEndBattle():void
  {
    const removeStatus = this.battle_status
    this.battle_status.clear();
    this.__bypass_scene__ = true;
    for(const status of removeStatus)status.onStatusRemoved(this);
    this.__bypass_scene__ = false;
  }
  /** Gets all the reactions from equipment, perks and status. */
  protected get reactions(): Reaction[]
  {
    const reactions = new ObjectSet<Reaction>()
    for(const equipment of this.character_equipment) { reactions.push(...equipment.reactions) }
    for(const perk of this.perks){reactions.push(...perk.reactions)}
    for(const status of this.iterStatus()){reactions.push(...status.reactions)}
    return reactions;
  };
  /** Gets all the tags from equipment, perks and status. */
  protected get tags():tag[]
  {
    const tags:tag[] = [];
    for(const equipment of this.character_equipment) tags.push(...equipment.tags)
    for(const status of this.iterStatus())tags.push(...status.tags)
    for(const perk of this.perks)tags.push(...perk.tags)
    return tags;
  }
  /** Apply the Battle Status effects. */
  protected startRoundApplyStatus():BattleCommand[]{
    return [...this.battle_status].map(status=>status.applyEffect(this));
  }
  /** Cooldown the SpecialAttacks */
  protected cooldownSpecials():void { for(const special of this.specialAttacks) special.cool() }
  calculateStats():void {
    this.calculated_stats = this.character_battle_class.calculate_stats(this.core_stats as FullCoreStats);
    this.calculated_resistance = {...this.original_resistance};
    for(const equipment of this.character_equipment){ equipment.applyModifiers(this); }
    for(const status of this.iterStatus()){ status.applyModifiers(this); }
  }
  /** Apply status effects. */
  protected applyStatus():void { for(const status of this.iterStatus()){ status.applyEffect(this); } }
  /** TODO */
  private _removeStatus(status: string | Status, status_array:Status[]): ActionOutput
  {
    if(status instanceof Status)
    {
      if(removeItem(status_array, status)) return status.onStatusRemoved(this);
      return [[],[]]
    }
    return this.remove_status_from_name(status,status_array);
  }
  private remove_status_from_name(status: string,status_array:Status[]) {
    let removeStatusDescription: ActionOutput = [[], []];
    let statusIndex = status_array.findIndex(characterStatus => (status === characterStatus.name));
    while (statusIndex >= 0) {
      const [statusRemoved] = status_array.splice(statusIndex, 1);
      removeStatusDescription = statusRemoved.onStatusRemoved(this);
      statusIndex = status_array.findIndex(characterStatus => (status === characterStatus.name));
    }
    return removeStatusDescription;
  }
  /** Use a special attack from the equpments, perks or status. */
  private _useSpecialAttack(item: SpecialAttack,targets: Character[]):BattleCommand
  {
    if(this.specialAttacks.has(item.hash()))
      return {
        source:this, target:targets, tags:item.tags,
        excecute:()=>{
          if(item.isSingleTarget)return tryAttack(this,targets[0],(target: Character)=>item.itemEffect(this,target))
          return targets.reduce( (descriptions,target)=>pushBattleActionOutput(item.itemEffect(this,target),descriptions),[[],[]] )
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
  toJson(): CharacterStoreable { return { Factory:"Character",type:this.type,battle_class:this.battle_class.toJson()} }
  fromJson(options: CharacterStoreable): void {
    options.battle_class&&(this.character_battle_class=CharacterBattleClassFactory(this.masterService,options.battle_class))
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
export type CharacterStoreable = { Factory: "Character"; type: characterType; battle_class:BattleClassOptions,[key: string]:any; }
/** Check if the statusname is the same as the second argument. */
function compareStatusName(status: string | Status, characterStatus: Status):boolean
{ return (status instanceof Status && status.constructor === characterStatus.constructor) || characterStatus.type === status; }
