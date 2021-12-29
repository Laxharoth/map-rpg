import { MasterService } from "src/app/service/master.service";
import { Description } from "src/gameLogic/custom/Class/Descriptions/Description";
import { AddExceedItem } from "src/gameLogic/custom/Class/Descriptions/DescriptionAddExceedItem";
import { Armor, ArmorNoArmor } from "src/gameLogic/custom/Class/Equipment/Armor/Armor";
import { Equipment } from "src/gameLogic/custom/Class/Equipment/Equipment";
import { Shield, ShieldNoShield } from "src/gameLogic/custom/Class/Equipment/Shield/Shield";
import { MeleeUnharmed, MeleeWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeWeapon";
import { RangedUnharmed, RangedWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Ranged/RangedWeapon";
import { Weapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Weapon";
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { Perk } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";
import { Status } from "src/gameLogic/custom/Class/Status/Status";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { isStatusPreventAttack, StatusBattle, StatusPreventAttack } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { TimedStatus } from "src/gameLogic/custom/Class/Status/TimedStatus";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";
import { pushBattleActionOutput, removeItem } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { BattleCommand, EmptyCommand } from "../Battle/BattleCommand";
import { CharacterBattleClass } from "../CharacterBattleClass/CharacterBattleClass";
import { TestCharacterBattleClass } from "../CharacterBattleClass/testCharacterBattleClass";
import { EnergyStats, CoreStats, ResistanceStats, ActionOutput, CalculatedStats, FullCoreStats, LevelStats } from "./Character.type";
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
  original_stats:CoreStats;
  original_resistance:ResistanceStats;
  /* The current status of the character after appling equipment during a battle round. */
  calculated_stats:CalculatedStats;
  calculated_resistance:ResistanceStats;
  gold:number = 0;

  protected perks:Perk[] = [];
  protected status:Status[] = [];
  protected timed_status:TimedStatus[] = [];
  protected battle_status:StatusBattle[] = [];
  protected character_battle_class:CharacterBattleClass;
  protected abstract _name:string;
  abstract readonly characterType:characterType;
  inventorysize = 9;
  inventory:GameItem[] = [];

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
    this.masterService = masterService;
    this.energy_stats = {...this.character_battle_class.initial_core_stats};
    this.current_energy_stats = {...this.energy_stats};
    this.level_stats = {experience:0, upgrade_point:0, level:0}
    this.original_stats = {...this.character_battle_class.initial_physic_stats};
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
  Attack(targets:Character[]):BattleCommand
  {
    const weapon = this.meleeWeapon;
    return new BattleCommand(
      this,targets,weapon.tags,
      (targets)=>{
        const attackDescription:ActionOutput = [[],[]];
        if(this.hasTag('double attack'))
          this.attackWithWeapon(targets, weapon, attackDescription);
        this.attackWithWeapon(targets, weapon, attackDescription);
        return attackDescription;
      }
    )
  }
  /**
   * Uses rangedWeapon to attack the target.
   *
   * @param {Character[]} targets The targets to attack.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  Shoot(targets:Character[]):BattleCommand
  {
    const weapon = this.rangedWeapon;
    return new BattleCommand(
      this,targets, weapon.tags,
      (targets)=>{
        const attackDescription:ActionOutput = [[],[]];
        if(this.hasTag('double shoot'))
          this.attackWithWeapon(targets, weapon, attackDescription);
        this.attackWithWeapon(targets, weapon, attackDescription);
        return attackDescription;
      }
    )
  }
  /**
   * Uses shield .defend
   *
   * @param {Character[]} target Defends with the equiped shield.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  Defend(target:Character[]):BattleCommand
  {
    const shield = this.shield;
    const defend_action = shield.defend(target)
    return new BattleCommand(
      this,target,shield.tags,
      (target)=>defend_action
    )
  }
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
    this.calculateStats()
    pushBattleActionOutput(this.startRoundApplyStatus(),roundDescription)
    this.cooldownSpecials();
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
    for(const status of this. battle_status)
    { pushBattleActionOutput(status.onStatusRemoved(this),description) }
    this.battle_status = [];
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
  get specialAttacks(): SpecialAttack[]
  {
    const specials: SpecialAttack[] = []
    for(const equipment of this.iterEquipment()) { pushSpecial(specials,equipment.specials) }
    for(const perk of this.perks){pushSpecial(specials,perk.specials)}
    for(const status of this.iterStatus()){pushSpecial(specials,status.specials)}
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
    if(!status.canApply(this))return [[], [`${this.name} resisted ${status.name}`]];
    if(status instanceof StatusBattle)return this.addBattleStatus(status)
    else if(status instanceof TimedStatus)return this.addTimedStatus(status);
    this.status.push(status);
    this.masterService.updateCharacter(this);
    return status.onStatusGainded(this)
  }
  /**
   * Adds perk if does not already has it.
   *
   * @param {Perk} perk The perk to add.
   * @return {*}  {void}
   * @memberof Character
   */
  addPerk(perk:Perk):void
  {
    if(this.perks.some(characterperk => characterperk.constructor ===  perk.constructor))return;
    this.perks.push(perk);
  }
  /**
   * Returns a perk if the character has it.
   *
   * @param {(Perk|perkname)} perkOrName The perk or perkname.
   * @return {*}  {Perk}
   * @memberof Character
   */
  getPerk(perkOrName:Perk|perkname):Perk
  {
    if(perkOrName instanceof Perk)return this.perks[this.perks.indexOf(perkOrName)];
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
    pushBattleActionOutput(this.removeRegularStatus(status),removeStatusDescription);
    pushBattleActionOutput(this.removeTimedStatus  (status),removeStatusDescription);
    pushBattleActionOutput(this.removeBattleStatus (status),removeStatusDescription);
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
   * Check if the attack action can be performed on the target character.
   *
   * @param {Character} target The target of the attack action.
   * @param {(target:Character)=>ActionOutput} action The action to be performed.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  tryAttack(target:Character , action:(target:Character)=>ActionOutput):ActionOutput
  {
    if(this.hasTag('paralized')) return [[],[`${this.name} is paralized and can't move`]];
    for(const status of this.iterStatus())
    {
      const preventAttackStatus = status as unknown as StatusPreventAttack;
      if(isStatusPreventAttack(preventAttackStatus) && !preventAttackStatus?.canAttack(target)) return preventAttackStatus.preventAttackDescription(target)
    }
    return  action(target);
  }
  /**
   * Adds Item to the inventory.
   *
   * @param {GameItem} item The item to add.
   * @return {*}  {void}
   * @memberof Character
   */
  addItem(item:GameItem):void
  {
    if(!item){console.warn("Item not found, Is null or undefined."); return;}
    this.fitItemIntoinventory(item);
    if(item.amount <= 0) return;
    if(this.inventory.length < this.inventorysize)
    {
      if(item.amount <= item.maxStack)
      {
        this.inventory.push(item);
        return;
      }
      for(const itemsFromStack of item.breakIntoStacks())this.addItem(itemsFromStack);
      return;
    }
    AddExceedItem(this.masterService,item,this)
  }
  dropItem(item: GameItem)
  {
    removeItem(this.inventory,item);
  }
  /**
   * Uses an item from inventory or SpecialAttack.
   *
   * @param {(number|GameItem|SpecialAttack)} itemIndexOrItem If number, the index of the array, If object, the actuall Item.
   * @param {Character[]} targets The targets the item will affect.
   * @param {('inventory'|'special')} [sourceItem=null] If index is provided the array is required.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  useItem(itemIndexOrItem: number|GameItem|SpecialAttack,targets: Character[],sourceItem:'inventory'|'special'=null):BattleCommand
  {
    if(itemIndexOrItem instanceof SpecialAttack)return this._useSpecialAttack(itemIndexOrItem,targets);
    if(itemIndexOrItem instanceof GameItem)return this._useItem(itemIndexOrItem,targets);
    if(sourceItem === 'special')return this._useSpecialAttack(itemIndexOrItem,targets);
    if(sourceItem === 'inventory')return this._useItem(itemIndexOrItem,targets);
    console.warn('item instance not provided or source not provided')
    return new EmptyCommand(this,targets)
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
    this.addItem(melee);
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
    this.addItem(ranged);
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
    this.addItem(armor);
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
    this.addItem(shield);
    shield&&shield.removeModifier(this)
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
    this.masterService.updateCharacter(this);
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
    this.masterService.updateCharacter(this);
    return this.current_energy_stats.hitpoints-hitpointsBeforeHeal;
  }
  gain_experience(experience:number):number {
    this.level_stats.experience+=experience;
    this.masterService.updateCharacter(this);
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
    this.battle_status = [];
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
    const reactions: Reaction[] = []
    for(const equipment of this.iterEquipment()) { pushReactions(reactions,equipment.reactions) }
    for(const perk of this.perks){pushReactions(reactions,perk.reactions)}
    for(const status of this.iterStatus()){pushReactions(reactions,status.reactions)}
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
    for(const status of this.battle_status)
    { pushBattleActionOutput(status.applyEffect(this),statusDescription) }
    return statusDescription;
  }
  /**
   * Cooldown the SpecialAttacks
   *
   * @protected
   * @memberof Character
   */
  protected cooldownSpecials():void { for(const special of this.specialAttacks) special.cooldown = Math.max(0,special.cooldown-1) }

  calculateStats():void {
    this.calculated_stats = this.character_battle_class.calculate_stats(this.original_stats as FullCoreStats);
    this.calculated_resistance = {...this.original_resistance};
    for(const status of this.status.concat(this.timed_status)){ status.applyModifiers(this); }
    for(const equipment of this.iterEquipment()){ equipment.applyModifiers(this); }
  }

  /**
   * Resets the stats of the character except hitpoints  and energypoints.
   * Apply modifiers of equipment and non Battle Status.
   *
   * @private
   * @memberof Character
   */
  private applyStatus():void { for(const status of this.status.concat(this.timed_status)){ status.applyEffect(this); } }
  /**
   * Check if the Item can be Inserted into the inventory.
   *
   * @private
   * @param {GameItem} item
   * @memberof Character
   */
  private fitItemIntoinventory(item: GameItem):void
  {
    if(item.amount<=0)return;
    for (const characteritem of this.inventory)
    {
      if (characteritem.constructor === item.constructor)
      {
        const characteriteramount = characteritem.amount;
        const itemamount = item.amount;
        const newcharacteritemamount = Math.min(characteriteramount + itemamount, item.maxStack);
        const newitemamount = itemamount - (newcharacteritemamount - characteriteramount);
        characteritem.amount = newcharacteritemamount;
        item.amount = newitemamount;
      }
    }
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
    let removeStatusDescription: ActionOutput = [[],[]];
    let statusIndex = this.battle_status.findIndex(characterStatus => (status===characterStatus.name));
    while (statusIndex >= 0)
    {
      const [statusRemoved] = this.battle_status.splice(statusIndex, 1);
      removeStatusDescription = statusRemoved.onStatusRemoved(this);
      statusIndex = this.battle_status.findIndex(characterStatus => (status===characterStatus.name));
    }
    return removeStatusDescription ;
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
    let removeStatusDescription: ActionOutput = [[],[]]
    let statusIndex = this.timed_status.findIndex(characterStatus => (status === characterStatus.name));
    while (statusIndex >= 0)
    {
      const [statusRemoved] = this.timed_status.splice(statusIndex, 1);
      removeStatusDescription = statusRemoved.onStatusRemoved(this);
      statusIndex = this.timed_status.findIndex(characterStatus => (status === characterStatus.name));
    }
    return removeStatusDescription ;
  }
  /**
   * Removes all instances of status with statusname.
   * Or remove the status provided.
   *
   * @private
   * @param {(string | Status)} status The status to remove.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  private removeRegularStatus(status: string | Status): ActionOutput
  {
    if(status instanceof Status)
    {
      if(removeItem(this.status, status))return status.onStatusRemoved(this);
      return [[],[]]
    }
    let removeStatusDescription: ActionOutput = [[],[]]
    let statusIndex = this.status.findIndex(characterStatus => (status===characterStatus.name));
    while (statusIndex >= 0)
    {
      const [statusRemoved] = this.status.splice(statusIndex, 1);
      removeStatusDescription = statusRemoved.onStatusRemoved(this);
      statusIndex = this.status.findIndex(characterStatus => (status===characterStatus.name));
    }
    return removeStatusDescription ;
  }
  /**
   * Adds  a status to Battle Status Array and calls onStatusGainded
   *
   * @private
   * @param {StatusBattle} status The status to add.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  private addBattleStatus(status: StatusBattle): ActionOutput
  {
    const statusDescription:ActionOutput = [[],[]]
    this.battle_status.push(status);
    pushBattleActionOutput(status.onStatusGainded(this),statusDescription)
    return statusDescription;
  }
  /**
   * Adds a Status the TimedStatus Array.
   *
   * @private
   * @param {TimedStatus} status The status to add
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  private addTimedStatus(status: TimedStatus): ActionOutput
  {
    const [statusDescription, statusString]:ActionOutput = [[],[]];
    this.timed_status.push(status);
    pushBattleActionOutput(status.onStatusGainded(this),[statusDescription, statusString]);
    return [statusDescription, statusString];
  }

  /**
   * Use an actial item from inventory
   *
   * @private
   * @param {(number|GameItem)} itemIndexOrItem The Index of the item or the item.
   * @param {Character[]} targets The targets the item will target.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  private _useItem(itemIndexOrItem: number|GameItem,targets: Character[]):BattleCommand
  {
    let itemIndex:number;
    if(itemIndexOrItem instanceof GameItem)itemIndex = this.inventory.indexOf(itemIndexOrItem);
    else itemIndex = itemIndexOrItem;
    if(itemIndex < 0) return new EmptyCommand(this,targets)
    const item = this.inventory[itemIndex];
    const item_action_output = item.itemEffect(this,targets);
    return new BattleCommand( this,targets,item.tags,(targets)=>item_action_output )
  }
  /**
   * Use a special attack from the equpments, perks or status.
   *
   * @private
   * @param {(number|SpecialAttack)} itemIndexOrItem The index of the SpecialAttack or the special attack.
   * @param {Character[]} targets The targets of the SpecialAttack.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  private _useSpecialAttack(itemIndexOrItem: number|SpecialAttack,targets: Character[]):BattleCommand
  {
    let itemIndex:number;
    const characterSpecials = this.specialAttacks;
    if(itemIndexOrItem instanceof SpecialAttack)itemIndex = characterSpecials.indexOf(itemIndexOrItem);
    else itemIndex = itemIndexOrItem;
    if(itemIndex < 0) return new EmptyCommand(this,targets)
    const item = characterSpecials[itemIndex];
    return new BattleCommand(this,targets,[],(targets)=>{
      const descriptions:Description[] = []
      const strings:string[] = []
      if(targets.length === 1)
      { pushBattleActionOutput(this.tryAttack(targets[0],(target: Character)=>item.itemEffect(this,target)),[descriptions,strings]) }
      else for(const target of targets)
      { pushBattleActionOutput(item.itemEffect(this,target),[descriptions,strings]) }
      return [descriptions,strings];
    })
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
   * Attacks with a weapon.
   *
   * @private
   * @param {Character[]} targets The targets to attack.
   * @param {Weapon} weapon The weapon used to attack the targets.
   * @param {ActionOutput} attackDescription
   * @memberof Character
   */
  private attackWithWeapon(targets: Character[], weapon: Weapon, attackDescription: ActionOutput) {
    for (const target of targets) pushBattleActionOutput(this.tryAttack(target, (target: Character) => weapon.attack(this, target)), attackDescription);
  }
  /**
   * The automatic action to perform.
   * @memberof Character
   */
  IA_Action():BattleCommand
  {
    const party = [this.masterService.partyHandler.user]
                  .concat(this.masterService.partyHandler.party)
    const enemy = this.masterService.enemyHandler.enemyFormation.enemies;
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

  total_experience_to_next_level() { return this.character_battle_class.total_experience_to_next_level(this.level_stats.level) }
  current_level_experience() { return this.character_battle_class.current_level_experience(this.level_stats) }
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
 function compareStatusName(status: string | Status, characterStatus: Status):boolean{
  return (status instanceof Status && status.constructor === characterStatus.constructor) || characterStatus.name === status;
}

/**
   * Pushes an array of Special Attack to another if not already present.
   *
   * @param {SpecialAttack[]} specials The original array
   * @param {SpecialAttack[]} specials2push The array of specials that will be pushed.
   */
 function pushSpecial(specials:SpecialAttack[],specials2push:SpecialAttack[])
 {
   for(const special of specials2push)
   {
     if(specials.some(pushed => pushed.constructor === special.constructor))continue;
     specials.push(special);
   }
 }
 /**
  * Pushes an array of reactions to another if not already present.
  *
  * @param {Reaction[]} reactions The original array
  * @param {Reaction[]} reactions2push The array of reactions that will be pushed.
  */
 function pushReactions(reactions:Reaction[],reactions2push:Reaction[])
 {
   for(const reaction of reactions2push)
   {
     if(reactions.some(pushed => pushed.constructor === reaction.constructor))continue;
     reactions.push(reaction);
   }
 }
