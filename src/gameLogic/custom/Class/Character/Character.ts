import { MasterService } from "src/app/service/master.service";
import { Armor, ArmorNoArmor } from "src/gameLogic/custom/Class/Equipment/Armor/Armor";
import { Equipment } from "src/gameLogic/custom/Class/Equipment/Equipment";
import { Shield, ShieldNoShield } from "src/gameLogic/custom/Class/Equipment/Shield/Shield";
import { MeleeUnharmed, MeleeWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeWeapon";
import { RangedUnharmed, RangedWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Ranged/RangedWeapon";
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { Perk } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";
import { Status } from "src/gameLogic/custom/Class/Status/Status";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { StatusBattle } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { TimedStatus } from "src/gameLogic/custom/Class/Status/TimedStatus";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";
import { pushBattleActionOutput, removeItem } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { ObjectSet } from "../../ClassHelper/ObjectSet";
import { AttackCommand, DefendCommand, ShootCommand, tryAttack } from "../Battle/Battle.functions";
import { BattleCommand, EmptyCommand } from "../Battle/BattleCommand";
import { CharacterBattleClass } from "../CharacterBattleClass/CharacterBattleClass";
import { TestCharacterBattleClass } from "../CharacterBattleClass/testCharacterBattleClass";
import { EnergyStats, CoreStats, ResistanceStats, ActionOutput, CalculatedStats, FullCoreStats, LevelStats } from "./Character.type";
import { Inventory } from "./Inventory/Inventory";
import { Reaction } from "./Reaction/Reaction";

/**
 * A model of a character.
 *
 * @export
 * @abstract
 * @class Character
 * @implements {storeable}
 * @constructor Initializes the masterService Should be overridden to set originalStats
 */
export abstract class Character
{
  energy_stats:EnergyStats;
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
  abstract readonly characterType:characterType;
  inventory:Inventory;

  private static __meleeUnharmed__:MeleeUnharmed;
  private static __rangedUnharmed__:RangedUnharmed;
  private static __noArmor__:ArmorNoArmor;
  private static __noShield__:ShieldNoShield;

  /** * The currently equiped melee weapon. */
  protected _meleeWeapon:MeleeWeapon = null;
  get meleeWeapon():MeleeWeapon { return this._meleeWeapon || Character.__meleeUnharmed__ }
  set meleeWeapon(equipment:MeleeWeapon){this._meleeWeapon=equipment}
  /** * The currently equiped rangedWeapon. */
  protected _rangedWeapon:RangedWeapon = null;
  get rangedWeapon():RangedWeapon { return this._rangedWeapon || Character.__rangedUnharmed__ }
  set rangedWeapon(equipment:RangedWeapon){this._rangedWeapon=equipment}
  /** * *The currently equiped armor. */
  protected _armor:Armor = null;
  get armor():Armor { return this._armor || Character.__noArmor__}
  set armor(equipment:Armor){this._armor=equipment}
  /** * The currently equiped shield. */
  protected _shield:Shield = null;
  get shield():Shield { return this._shield || Character.__noShield__}
  set shield(equipment:Shield){this._shield=equipment}

  get name(): string{ return this._name};
  protected readonly masterService:MasterService
  private __endbattle__ = false;

  /**
   * Creates an instance of Character.
   * @param {characterStats} originalstats The original stats of the character
   * @param {MasterService} masterService The master service.
   * @memberof Character
   */
  constructor(masterService:MasterService, character_battle_class=null)
  {
    if(!character_battle_class)character_battle_class=new TestCharacterBattleClass()
    this.character_battle_class = character_battle_class;
    this.inventory = new Inventory(masterService);
    this.masterService = masterService;
    this.energy_stats = {...this.character_battle_class.initial_core_stats};
    this.current_energy_stats = {...this.energy_stats};
    this.level_stats = {experience:0, upgrade_point:0, perk_point:0, level:0, upgrade_path:[]}
    this.core_stats = {...this.character_battle_class.initial_physic_stats};
    this.original_resistance = {...this.character_battle_class.initial_resistance_stats};
    this.initializeUnharmed();
    this.calculateStats();
    this.applyStatus();
  }
  /**
   * Uses the meleeWeapon to attack the target.
   *
   * @param {Character[]} targets The characters to attack.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  Attack(targets:Character[]):BattleCommand{return AttackCommand(this,targets)}
  /**
   * Uses rangedWeapon to attack the target.
   *
   * @param {Character[]} targets The targets to attack.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  Shoot(targets:Character[]):BattleCommand{return ShootCommand(this,targets)}

  /**
   * Uses shield .defend
   *
   * @param {Character[]} target Defends with the equiped shield.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  Defend(target:Character[]):BattleCommand{return DefendCommand(this,target)}

  /**
   * Reset roundStats apply the battle status effects and cooldown the specials.
   *
   * @return {*}  {ActionOutput}
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
   * @return {*}  {ActionOutput}
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
  hasStatus(status:Status|statusname):number
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
    for(const equipment of this.iterEquipment()) { specials.push(...equipment.specials) }
    for(const perk of this.perks) { specials.push(...perk.specials) }
    for(const status of this.iterStatus()) { specials.push(...status.specials) }
    return specials
  };
  /**
   * Checks if the character has a tag.
   *
   * @param {tag} tag The tag to check.
   * @return {*}  {boolean}
   * @memberof Character
   */
  hasTag(tag:tag):boolean { return this.tags.includes(tag); }
  /**
   *TODO add description
   *
   * @return {*}  {boolean}
   * @memberof Character
   */
  is_defeated():boolean{return this.current_energy_stats.hitpoints<=0}
  /**
   * Adds status to the character. to the correct Array if able.
   *
   * @param {Status} status The status to add to the character.
   * @return {*}  {ActionOutput}
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
   * @return {*}  {void}
   * @memberof Character
   */
  addPerk(perk:Perk):void { this.perks.push(perk); }
  /**
   * Returns a perk if the character has it.
   *
   * @param {(Perk|perkname)} perkOrName The perk or perkname.
   * @return {*}  {Perk}
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
   * @param {(Status|statusname)} status
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  removeStatus(status:Status|statusname):ActionOutput
  {
    let removeStatusDescription:ActionOutput = [[],[]];
    pushBattleActionOutput(this.removeTimedStatus(status) ,removeStatusDescription);
    pushBattleActionOutput(this.removeBattleStatus(status),removeStatusDescription);
    pushBattleActionOutput(this._removeStatus(status),removeStatusDescription);
    this.calculateStats();
    return removeStatusDescription;
  }
  /**
   * Gets the first instance of Status that matches the statusname or type of Status
   *
   * @param {statusname} status
   * @return {*}  {(Status|null)}
   * @memberof Character
   */
  getStatus(status: statusname):Status|null{
    for(const characterStatus of this.iterStatus())if(compareStatusName(status, characterStatus))return characterStatus;
    return null;
  }
  /**
   * Unequip melee weapon and adds it to the inventory.
   *
   * @memberof Character
   */
  unequipMelee()
  {
    const melee = this._meleeWeapon;
    if(melee)melee.amount++
    this._meleeWeapon = null;
    this.inventory.addItem(melee);
    melee&&melee.removeModifier(this)
  }
  /**
   * Unequip ranged weapon and adds it to the inventory.
   *
   * @memberof Character
   */
  unequipRanged()
  {
    const ranged = this._rangedWeapon;
    if(ranged)ranged.amount++;
    this._rangedWeapon = null;
    this.inventory.addItem(ranged);
    ranged&&ranged.removeModifier(this)
  }
  /**
   * Unequip armor and adds it to the inventory.
   *
   * @memberof Character
   */
  unequipArmor()
  {
    const armor = this._armor;
    if(armor)armor.amount++;
    this._armor = null;
    this.inventory.addItem(armor);
    armor&&armor.removeModifier(this)
  }
  /**
   * Unequip shield and adds it to the inventory.
   *
   * @memberof Character
   */
  unequipShield()
  {
    const shield = this._shield;
    if(shield)shield.amount++;
    this._shield = null;
    this.inventory.addItem(shield);
    shield&&shield.removeModifier(this)
  }
  useItem(item: GameItem | SpecialAttack, targets: Character[]): BattleCommand {
    if (item instanceof SpecialAttack) return this._useSpecialAttack(item, targets);
    if (item instanceof GameItem)
    {
      const description =  this.inventory.useItem(item, this, targets);
      return new BattleCommand(this,targets,['item-use'],()=>description)
    }
    console.warn('item not in inventory')
    return new EmptyCommand(this, targets)
  }
  /**
   * Iterator of character equipment.
   *
   * @memberof Character
   */
  iterEquipment = function*():Generator<Equipment, void, unknown>
                  {
                    yield this.meleeWeapon;
                    yield this.rangedWeapon;
                    yield this.armor;
                    yield this.shield;
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
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  react(whatTriggers:tag[],source: Character):ActionOutput
  {
    const reactDescription:ActionOutput = [[],[]]
    if( this.current_energy_stats.hitpoints<=0  || this.__endbattle__ )return reactDescription;
    for(const reaction of this.reactions)
    { pushBattleActionOutput(reaction.reaction(whatTriggers,this,source,[this]),reactDescription);}
    return reactDescription
  }
  battle_command_react(battle_command:BattleCommand)
  {
    const reactDescription:ActionOutput = [[],[]]
    if( this.current_energy_stats.hitpoints<=0  || this.__endbattle__ )return reactDescription;
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
    this.current_energy_stats.hitpoints=Math.min(this.energy_stats.hitpoints,this.current_energy_stats.hitpoints+hitpointsgain);
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
  get currentStatusString():string { return `${this.name} looks like they are ${this.current_energy_stats.hitpoints} in a scale of 0 to ${this.energy_stats.hitpoints}`}

  /**
   * Removes all the Battle Status without trigger reactions.
   *
   * @memberof Character
   */
  onEndBattle():void
  {
    const removeStatus = this.battle_status
    this.battle_status.clear();
    this.__endbattle__ = true;
    for(const status of removeStatus)status.onStatusRemoved(this);
    this.__endbattle__ = false;
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
    for(const equipment of this.iterEquipment()) { reactions.push(...equipment.reactions) }
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
    for(const equipment of this.iterEquipment()) tags.push(...equipment.tags)
    for(const status of this.iterStatus())tags.push(...status.tags)
    for(const perk of this.perks)tags.push(...perk.tags)
    return tags;
  }
  /**
   * Apply the Battle Status effects.
   *
   * @protected
   * @return {*}  {ActionOutput}
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
    for(const equipment of this.iterEquipment()){ equipment.applyModifiers(this); }
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
   * Removes all instances of Status
   * Or remove the status provided.
   *
   * @private
   * @param {(string | Status)} status The status to remove.
   * @return {*} {ActionOutput}
   * @memberof Character
   */
   private _removeStatus(status: string | Status):ActionOutput
   {
     if(status instanceof Status)
     {
       if(removeItem(this.status, status))return status.onStatusRemoved(this);
       return [[],[]]
     }
     return remove_status_from_name(status,this.battle_status);
   }
  /**
   * Removes all instances of battleStatus
   * Or remove the status provided.
   *
   * @private
   * @param {(string | Status)} status The status to remove.
   * @return {*} {ActionOutput}
   * @memberof Character
   */
  private removeBattleStatus(status: string | Status):ActionOutput
  {
    if(status instanceof StatusBattle)
    {
      if(removeItem(this.battle_status, status))return status.onStatusRemoved(this);
      return [[],[]]
    }
    if(status instanceof Status)return [[],[]];
    return remove_status_from_name(status,this.battle_status);
  }
  /**
   * Removes all instances TimedStatus
   * Or remove the status provided.
   *
   * @private
   * @param {(string | Status)} status The status to remove.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  private removeTimedStatus(status: string | Status): ActionOutput
  {
    if(status instanceof TimedStatus)
    {
      if(removeItem(this.timed_status, status)) return status.onStatusRemoved(this);
      return [[],[]]
    }
    if(status instanceof Status)return [[],[]];
    return remove_status_from_name(status,this.timed_status);
  }
  /**
   * Use a special attack from the equpments, perks or status.
   *
   * @private
   * @param {(number|SpecialAttack)} item The index of the SpecialAttack or the special attack.
   * @param {Character[]} targets The targets of the SpecialAttack.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  private _useSpecialAttack(item: SpecialAttack,targets: Character[]):BattleCommand
  {
    if(this.specialAttacks.has(item.hash()))
      return new BattleCommand(this,targets,[],(targets)=>{
        if(item.isSingleTarget)return tryAttack(this,targets[0],(target: Character)=>item.itemEffect(this,target))
        const descriptions:ActionOutput = [[],[]]
        for(const target of targets)
        { pushBattleActionOutput(item.itemEffect(this,target),descriptions) }
        return descriptions;
      })
    return new EmptyCommand(this,targets);
  }
  /**
   * Initializes the unharmed equpments.
   *
   * @private
   * @memberof Character
   */
  private initializeUnharmed() {
    if(!Character.__meleeUnharmed__)
    {
      Character.__meleeUnharmed__   = new MeleeUnharmed(this.masterService);
      Character.__rangedUnharmed__  = new RangedUnharmed(this.masterService);
      Character.__noArmor__         = new ArmorNoArmor(this.masterService);
      Character.__noShield__        = new ShieldNoShield(this.masterService);
    }
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
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  protected abstract _IA_Action(ally: Character[], enemy: Character[]):BattleCommand;
}
/**
 * Check if the statusname is the same as the second argument.
 *
 * @private
 * @param {(string | Status)} status The status name to check.
 * @param {Status} characterStatus The status to check.
 * @return {*}
 * @memberof Character
 */
function compareStatusName(status: string | Status, characterStatus: Status):boolean
{ return (status instanceof Status && status.constructor === characterStatus.constructor) || characterStatus.name === status; }

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
