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
import { EnergyStats, CoreStats, ResistanceStats, ActionOutput, CalculatedStats, FullCoreStats, LevelStats } from "./Character.type";
import { Inventory } from "./Inventory/Inventory";
import { Reaction } from "./Reaction/Reaction";
import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { CharacterBattleClassFactory } from '../../Factory/CharacterBattleClassFactory';

/**
 * A model of a character.
 *
 * @export
 * @abstract
 * @class Character
 * @implements {storeable}
 * @constructor Initializes the masterService Should be overridden to set originalStats
 */
export abstract class Character implements storeable
{
  level_stats:LevelStats;
  current_energy_stats:EnergyStats;
  /* The original stats of the character. */
  core_stats:CoreStats;
  original_resistance:ResistanceStats;
  /* The current status of the character after appling equipment during a battle round. */
  calculated_stats:CalculatedStats;
  calculated_resistance:ResistanceStats;
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
  /**
   * Creates an instance of Character.
   * @param {characterStats} originalstats The original stats of the character
   * @param {MasterService} masterService The master service.
   * @memberof Character
   */
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
  /**
   * Uses the meleeWeapon to attack the target.
   *
   * @param {Character[]} targets The characters to attack.
   * @return { ActionOutput }
   * @memberof Character
   */
  Attack(targets:Character[]):BattleCommand{return AttackCommand(this,targets)}
  /**
   * Uses rangedWeapon to attack the target.
   *
   * @param {Character[]} targets The targets to attack.
   * @return { ActionOutput }
   * @memberof Character
   */
  Shoot(targets:Character[]):BattleCommand{return ShootCommand(this,targets)}
  /**
   * Uses shield .defend
   *
   * @param {Character[]} target Defends with the equiped shield.
   * @return { ActionOutput }
   * @memberof Character
   */
  Defend(target:Character[]):BattleCommand{return DefendCommand(this,target)}
  unequipMelee(){this.character_equipment.unequipMelee(this)}
  unequipRanged(){this.character_equipment.unequipRanged(this)}
  unequipArmor(){this.character_equipment.unequipArmor(this)}
  unequipShield(){this.character_equipment.unequipShield(this)}
  /**
   * Reset roundStats apply the battle status effects and cooldown the specials.
   *
   * @return { ActionOutput }
   * @memberof Character
   */
  startRound():ActionOutput
  {
    const roundDescription:ActionOutput = [[],[]];
    roundDescription[1].push(this.currentStatusString);
    pushBattleActionOutput(this.startRoundApplyStatus(),roundDescription)
    this.cooldownSpecials();
    this.calculateStats()
    return roundDescription;
  }
  /**
   * Removes the battle status.
   *
   * @return { ActionOutput }
   * @memberof Character
   */
  onDefeated():ActionOutput
  {
    let description:ActionOutput =[[],[]]
    for(const status of this.battle_status)
    { pushBattleActionOutput(status.onStatusRemoved(this),description) }
    this.battle_status.clear()
    return description;
  }
  /**
   * Gets the number of instances of a specific status in the character
   * @param status The name of the status to check
   * @returns The number of instance of the status applied
   */
  hasStatus(status:Status|statustype):number
  {
    let timesFound = 0;
    for(const characterStatus of this.iterStatus())
      if(compareStatusName(status, characterStatus))
        timesFound++;
    return timesFound;
  }
  /**
   * Gets all the specials from equipments, perks and status.
   *
   * @readonly
   * @type {SpecialAttack[]}
   * @memberof Character
   */
  get specialAttacks(): ObjectSet<SpecialAttack>
  {
    const specials= new ObjectSet<SpecialAttack>()
    for(const equipment of this.character_equipment) { specials.push(...equipment.specials) }
    for(const perk of this.perks) { specials.push(...perk.specials) }
    for(const status of this.iterStatus()) { specials.push(...status.specials) }
    return specials
  };
  /**
   * Checks if the character has a tag.
   *
   * @param {tag} tag The tag to check.
   * @return { boolean }
   * @memberof Character
   */
  hasTag(tag:tag):boolean { return this.tags.includes(tag); }
  /**
   * TODO add description
   *
   * @return { boolean }
   * @memberof Character
   */
  is_defeated():boolean{return this.current_energy_stats.hitpoints<=0}
  /**
   * Adds status to the character. to the correct Array if able.
   *
   * @param {Status} status The status to add to the character.
   * @return { ActionOutput }
   * @memberof Character
   */
  addStatus(status: Status): ActionOutput{
    if(!status)return [[],[]]
    if(this.timed_status.has(status.hash()) || this.battle_status.has(status.hash()))
      return pushBattleActionOutput(this.react(this.tags.concat(['status regained']),this),[[],[`${this.name} is already affected by ${status.name}`]])
    if(!status.canApply(this))return [[], [`${this.name} resisted ${status.name}`]];
    if(status instanceof StatusBattle) this.battle_status.push(status);
    else if(status instanceof TimedStatus) this.timed_status.push(status);
    else this.status.push(status);
    return status.onStatusGainded(this)
  }
  /**
   * Adds perk if does not already has it.
   *
   * @param {Perk} perk The perk to add.
   * @memberof Character
   */
  addPerk(perk:Perk):void { this.perks.push(perk); }
  /**
   * Returns a perk if the character has it.
   *
   * @param {(Perk|perkname)} perkOrName The perk or perkname.
   * @return { Perk }
   * @memberof Character
   */
  getPerk(perkOrName:Perk|perkname):Perk
  {
    if(perkOrName instanceof Perk)return this.perks.get(perkOrName.hash());
    for(const perk of this.perks)if(perk.name === perkOrName)return perk;
    return null;
  }
  /**
   * Removes all instances of the given statusname or Status.
   *
   * @param {(Status|statustype)} status
   * @return { ActionOutput }
   * @memberof Character
   */
  removeStatus(status:Status|statustype):ActionOutput
  {
    let removeStatusDescription:ActionOutput = [[],[]];
    pushBattleActionOutput(this._removeStatus(status,this.battle_status),removeStatusDescription);
    pushBattleActionOutput(this._removeStatus(status,this.timed_status),removeStatusDescription);
    pushBattleActionOutput(this._removeStatus(status,this.status),removeStatusDescription);
    this.calculateStats();
    return removeStatusDescription;
  }
  /**
   * Gets the first instance of Status that matches the statusname or type of Status
   *
   * @param {statustype} status
   * @return { (Status|null) }
   * @memberof Character
   */
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
  /**
   * Iterator of character status.
   *
   * @memberof Character
   */
  iterStatus    = function*():Generator<Status, void,unknown>
                  {
                    for(const status of this.status) yield status;
                    for(const status of this.timed_status) yield status;
                    for(const status of this.battle_status) yield status;
                  }
  /**
   * Checks all the reactions of the character.
   * Won't react if character is paralized, zero hitpoints or the battle ended.
   *
   * @param {tag[]} whatTriggers The tags to match the reaction.
   * @param {Character} source The character whose action triggered the reactions.
   * @return { ActionOutput }
   * @memberof Character
   */
  react(whatTriggers:tag[],source: Character):ActionOutput
  {
    const reactDescription:ActionOutput = [[],[]]
    if( this.current_energy_stats.hitpoints<=0  || this.__bypass_scene__ )return reactDescription;
    for(const reaction of this.reactions)
    { pushBattleActionOutput(reaction.reaction(whatTriggers,this,source,[this]),reactDescription);}
    return reactDescription
  }
  battle_command_react(battle_command:BattleCommand)
  {
    const reactDescription:ActionOutput = [[],[]]
    if( this.current_energy_stats.hitpoints<=0  || this.__bypass_scene__ )return reactDescription;
    for(const reaction of this.reactions)
    { pushBattleActionOutput(reaction.reaction(battle_command.tags,this,battle_command.source,battle_command.target),reactDescription);}
    return reactDescription
  }
  /**
   * Reduces the character hitpoints up to zero.
   *
   * @param {number} damage The damage taken by the character.
   * @return {number} The number of hitpoints of damage taken.
   * @memberof Character
   */
  takeDamage(damage:number):number
  {
    const hitpointsBeforeDamage = this.current_energy_stats.hitpoints;
    this.current_energy_stats.hitpoints=Math.max(0,this.current_energy_stats.hitpoints-damage);
    return this.current_energy_stats.hitpoints-hitpointsBeforeDamage;
  }
  /**
   * Heals hitpoints from the character up to original hitpoints.
   *
   * @param {number} hitpointsgain The number of hitpoints to gain.
   * @return {number} The hitpoints that were healed.
   * @memberof Character
   */
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
  /**
   * Gets the current status of the character.
   *
   * @readonly
   * @type {string}
   * @memberof Character
   */
  get currentStatusString():string { return `${this.name} looks like they are ${this.current_energy_stats.hitpoints} in a scale of 0 to ${this.calculated_stats.hitpoints}`}
  /**
   * Removes all the Battle Status without trigger reactions.
   *
   * @memberof Character
   */
  onEndBattle():void
  {
    const removeStatus = this.battle_status
    this.battle_status.clear();
    this.__bypass_scene__ = true;
    for(const status of removeStatus)status.onStatusRemoved(this);
    this.__bypass_scene__ = false;
  }
  /**
   * Gets all the reactions from equipment, perks and status.
   *
   * @readonly
   * @protected
   * @type {Reaction[]}
   * @memberof Character
   */
  protected get reactions(): Reaction[]
  {
    const reactions = new ObjectSet<Reaction>()
    for(const equipment of this.character_equipment) { reactions.push(...equipment.reactions) }
    for(const perk of this.perks){reactions.push(...perk.reactions)}
    for(const status of this.iterStatus()){reactions.push(...status.reactions)}
    return reactions;
  };
  /**
   * Gets all the tags from equipment, perks and status.
   *
   * @readonly
   * @protected
   * @type {tag[]}
   * @memberof Character
   */
  protected get tags():tag[]
  {
    const tags:tag[] = [];
    for(const equipment of this.character_equipment) tags.push(...equipment.tags)
    for(const status of this.iterStatus())tags.push(...status.tags)
    for(const perk of this.perks)tags.push(...perk.tags)
    return tags;
  }
  /**
   * Apply the Battle Status effects.
   *
   * @protected
   * @return { ActionOutput }
   * @memberof Character
   */
  protected startRoundApplyStatus():ActionOutput
  {
    const statusDescription:ActionOutput = [[],[]]
    for(const status of [...this.battle_status])
    { pushBattleActionOutput(status.applyEffect(this),statusDescription) }
    return statusDescription;
  }
  /**
   * Cooldown the SpecialAttacks
   *
   * @protected
   * @memberof Character
   */
  protected cooldownSpecials():void { for(const special of this.specialAttacks) special.cool() }
  calculateStats():void {
    this.calculated_stats = this.character_battle_class.calculate_stats(this.core_stats as FullCoreStats);
    this.calculated_resistance = {...this.original_resistance};
    for(const equipment of this.character_equipment){ equipment.applyModifiers(this); }
    for(const status of this.iterStatus()){ status.applyModifiers(this); }
  }
  /**
   * Apply status effects.
   *
   * @protected
   * @memberof Character
   */
  protected applyStatus():void { for(const status of this.iterStatus()){ status.applyEffect(this); } }
  /**
   *
   *
   * @private
   * @param {(string | Status)} status The status to remove
   * @param {Status[]} status_array The array where the status will be removed.
   * @return { ActionOutput }
   * @memberof Character
   */
  private _removeStatus(status: string | Status, status_array:Status[]): ActionOutput
  {
    if(status instanceof Status)
    {
      if(removeItem(status_array, status)) return status.onStatusRemoved(this);
      return [[],[]]
    }
    return remove_status_from_name(status,status_array);
  }
  /**
   * Use a special attack from the equpments, perks or status.
   *
   * @private
   * @param {(number|SpecialAttack)} item The index of the SpecialAttack or the special attack.
   * @param {Character[]} targets The targets of the SpecialAttack.
   * @return { ActionOutput }
   * @memberof Character
   */
  private _useSpecialAttack(item: SpecialAttack,targets: Character[]):BattleCommand
  {
    if(this.specialAttacks.has(item.hash()))
      return {source:this,target:targets,tags:[],excecute:()=>{
        if(item.isSingleTarget)return tryAttack(this,targets[0],(target: Character)=>item.itemEffect(this,target))
        const descriptions:ActionOutput = [[],[]]
        for(const target of targets)
        { pushBattleActionOutput(item.itemEffect(this,target),descriptions) }
        return descriptions;
      }}
    return new EmptyCommand(this,targets);
  }
  /**
   * The automatic action to perform.
   * @memberof Character
   */
  IA_Action():BattleCommand
  {
    const party = [this.masterService.partyHandler.user]
                  .concat(this.masterService.partyHandler.party)
    const enemy = this.masterService.partyHandler.enemyFormation.enemies;
    return this._IA_Action(party,enemy)
  }
  /**
   * The logic behind the action.
   *
   * @abstract
   * @param {Character[]} ally The player party.
   * @param {Character[]} enemy The enemy party.
   * @return {BattleCommand}
   * @memberof Character
   */
  protected abstract _IA_Action(ally: Character[], enemy: Character[]):BattleCommand;
  toJson(): CharacterStoreable { return { Factory:"Character",type:this.type,battle_class:this.battle_class.toJson()} }
  fromJson(options: CharacterStoreable): void {
    options.battle_class&&(this.character_battle_class=CharacterBattleClassFactory(this.masterService,options.battle_class))
  }
}
export type CharacterStoreable = { Factory: "Character"; type: characterType; battle_class:BattleClassOptions,[key: string]:any; }
/**
 * Check if the statusname is the same as the second argument.
 */
function compareStatusName(status: string | Status, characterStatus: Status):boolean
{ return (status instanceof Status && status.constructor === characterStatus.constructor) || characterStatus.type === status; }
function remove_status_from_name(status: string,status_array:Status[]) {
  let removeStatusDescription: ActionOutput = [[], []];
  let statusIndex = status_array.findIndex(characterStatus => (status === characterStatus.name));
  while (statusIndex >= 0) {
    const [statusRemoved] = status_array.splice(statusIndex, 1);
    removeStatusDescription = statusRemoved.onStatusRemoved(this);
    statusIndex = status_array.findIndex(characterStatus => (status === characterStatus.name));
  }
  return removeStatusDescription;
}
