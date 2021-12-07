import { MasterService } from "src/app/service/master.service";
import { factoryname } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { Description } from "src/gameLogic/custom/Class/Descriptions/Description";
import { AddExceedItem } from "src/gameLogic/custom/Class/Descriptions/DescriptionAddExceedItem";
import { Armor, ArmorNoArmor } from "src/gameLogic/custom/Class/Equipment/Armor/Armor";
import { Equipment } from "src/gameLogic/custom/Class/Equipment/Equipment";
import { Shield, ShieldNoShield } from "src/gameLogic/custom/Class/Equipment/Shield/Shield";
import { MeleeUnharmed, MeleeWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeWeapon";
import { RangedUnharmed, RangedWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Ranged/RangedWeapon";
import { Weapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Weapon";
import { GameItem, ItemStoreable } from 'src/gameLogic/custom/Class/Items/Item';
import { itemname } from 'src/gameLogic/custom/Class/Items/Item.type';
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { Perk, PerkStoreable } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";
import { Status, StatusStoreable } from "src/gameLogic/custom/Class/Status/Status";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { isStatusPreventAttack, StatusBattle, StatusPreventAttack } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { TimedStatus } from "src/gameLogic/custom/Class/Status/TimedStatus";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { PerkFactory } from 'src/gameLogic/custom/Factory/PerkFactory';
import { StatusFactory } from 'src/gameLogic/custom/Factory/StatusFactory';
import { loadCharacterStats, pushBattleActionOutput, removeItem } from "src/gameLogic/custom/functions/htmlHelper.functions";
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
export abstract class Character implements storeable
{
  coreStats:coreStats;
  currentCoreStats:coreStats;
  /** * The original stats of the character. */
  originalstats:physicStats;
  originalResistance:resistanceStats;
  /** * The current stats of the character after appling equipment, status, etc modifiers. */
  stats:physicStats;
  resistance:resistanceStats;
  /** * The current status of the character after appling equipment during a battle round. */
  roundStats:physicStats;
  roundResistance:resistanceStats;
  gold:number = 0;
  private perks:Perk[] = [];
  private statuses:Status[] = [];
  private timedStatus:TimedStatus[] = [];
  private battleStatus:StatusBattle[] = [];
  abstract readonly characterType:characterType;
  inventorysize = 9;
  inventory:GameItem[] = [];

  private static __meleeUnharmed__:MeleeUnharmed;
  private static __rangedUnharmed__:RangedUnharmed;
  private static __noArmor__:ArmorNoArmor;
  private static __noShield__:ShieldNoShield;

  /** * The currently equiped melee weapon. */
  private _meleeWeapon:MeleeWeapon = null;
  get meleeWeapon():MeleeWeapon { return this._meleeWeapon || Character.__meleeUnharmed__ }
  set meleeWeapon(equipment:MeleeWeapon){this._meleeWeapon=equipment}
  /** * The currently equiped rangedWeapon. */
  private _rangedWeapon:RangedWeapon = null;
  get rangedWeapon():RangedWeapon { return this._rangedWeapon || Character.__rangedUnharmed__ }
  set rangedWeapon(equipment:RangedWeapon){this._rangedWeapon=equipment}
  /** * *The currently equiped armor. */
  private _armor:Armor = null;
  get armor():Armor { return this._armor || Character.__noArmor__}
  set armor(equipment:Armor){this._armor=equipment}
  /** * The currently equiped shield. */
  private _shield:Shield = null;
  get shield():Shield { return this._shield || Character.__noShield__}
  set shield(equipment:Shield){this._shield=equipment}

  abstract get name(): string;
  private readonly masterService:MasterService
  private __endbattle__ = false;

  /**
   * Creates an instance of Character.
   * @param {characterStats} originalstats The original stats of the character
   * @param {MasterService} masterService The master service.
   * @memberof Character
   */
  constructor( originalstats:characterStats,
    masterService:MasterService)
  {
    this.masterService = masterService;
    ({core:this.coreStats,physic:this.originalstats,resistance:this.originalResistance} = loadCharacterStats(originalstats))
    this.currentCoreStats = {...this.coreStats};
    this.stats = {...this.originalstats};
    this.resistance = {...this.originalResistance};
    this.initializeUnharmed();
    this.applyStatus();
  }
  /**
   * Uses the meleeWeapon to attack the target.
   *
   * @param {Character[]} targets The characters to attack.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  Attack(targets:Character[]):ActionOutput
  {
    const attackDescription:ActionOutput = [[],[]];
    const weapon = this.meleeWeapon;
    if(this.hasTag('double attack'))
      this.attackWithWeapon(targets, weapon, attackDescription);
    this.attackWithWeapon(targets, weapon, attackDescription);
    return attackDescription;
  }
  /**
   * Uses rangedWeapon to attack the target.
   *
   * @param {Character[]} targets The targets to attack.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  Shoot(targets:Character[]):ActionOutput
  {
    const attackDescription:ActionOutput = [[],[]];
    const weapon = this.rangedWeapon;
    if(this.hasTag('double shoot'))
      this.attackWithWeapon(targets, weapon, attackDescription);
    this.attackWithWeapon(targets, weapon, attackDescription);
    return attackDescription;
  }
  /**
   * Uses shield .defend
   *
   * @param {Character[]} target Defends with the equiped shield.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  Defend(target:Character[]):ActionOutput
  {
    return this.shield.defend(this);
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
    this.roundStats = {...this.stats};
    this.roundResistance = {...this.resistance};
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
    for(const status of this. battleStatus)
    { pushBattleActionOutput(status.onStatusRemoved(this),description) }
    this.battleStatus = [];
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
      if(this.compareStatusName(status, characterStatus))
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
    for(const equipment of this.iterEquipment()) { this.pushSpecial(specials,equipment.specials) }
    for(const perk of this.perks){this.pushSpecial(specials,perk.specials)}
    for(const status of this.iterStatus()){this.pushSpecial(specials,status.specials)}
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
    this.statuses.push(status);
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
    this.applyStatus();
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
    for(const characterStatus of this.iterStatus())if(this.compareStatusName(status, characterStatus))return characterStatus;
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
      if(isStatusPreventAttack(preventAttackStatus)      && !preventAttackStatus?.canAttack(target)) return preventAttackStatus.preventAttackDescription(target)
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
    this.masterService.descriptionHandler
      .tailDescription(AddExceedItem(this.masterService,item,this),'item')
      .flush(0)
      .setDescription(false);
    return;
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
  useItem(itemIndexOrItem: number|GameItem|SpecialAttack,targets: Character[],sourceItem:'inventory'|'special'=null):ActionOutput
  {
    if(itemIndexOrItem instanceof SpecialAttack)return this._useSpecialAttack(itemIndexOrItem,targets);
    if(itemIndexOrItem instanceof GameItem)return this._useItem(itemIndexOrItem,targets);
    if(sourceItem === 'special')return this._useSpecialAttack(itemIndexOrItem,targets);
    if(sourceItem === 'inventory')return this._useItem(itemIndexOrItem,targets);
    console.warn('item instance not provided or source not provided')
    return [[],[]]
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
                    for(const status of this.statuses) yield status;
                    for(const status of this.timedStatus) yield status;
                    for(const status of this.battleStatus) yield status;
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
    if( this.hasTag('paralized') ||
        this.currentCoreStats.hitpoints<=0  ||
        this.__endbattle__         )
      return reactDescription;
    for(const reaction of this.reactions){ pushBattleActionOutput(reaction.reaction(whatTriggers,source,this),reactDescription);}
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
    const hitpointsBeforeDamage = this.currentCoreStats.hitpoints;
    this.currentCoreStats.hitpoints=Math.max(0,this.currentCoreStats.hitpoints-damage);
    this.masterService.updateCharacter(this);
    return this.currentCoreStats.hitpoints-hitpointsBeforeDamage;
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
    const hitpointsBeforeHeal = this.currentCoreStats.hitpoints;
    this.currentCoreStats.hitpoints=Math.min(this.coreStats.hitpoints,this.currentCoreStats.hitpoints+hitpointsgain);
    this.masterService.updateCharacter(this);
    return this.currentCoreStats.hitpoints-hitpointsBeforeHeal;
  }
  /**
   * Gets the current status of the character.
   *
   * @readonly
   * @type {string}
   * @memberof Character
   */
  get currentStatusString():string { return `${this.name} looks like they are ${this.currentCoreStats.hitpoints} in a scale of 0 to ${this.coreStats.hitpoints}`}

  /**
   * Removes all the Battle Status without trigger reactions.
   *
   * @memberof Character
   */
  onEndBattle():void
  {
    const removeStatus = this.battleStatus
    this.battleStatus = [];
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
    for(const equipment of this.iterEquipment()) { this.pushReactions(reactions,equipment.reactions) }
    for(const perk of this.perks){this.pushReactions(reactions,perk.reactions)}
    for(const status of this.iterStatus()){this.pushReactions(reactions,status.reactions)}
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
    for(const status of this.battleStatus)
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

  /**
   * Resets the stats of the character except hitpoints  and energypoints.
   * Apply modifiers of equipment and non Battle Status.
   *
   * @private
   * @memberof Character
   */
  private applyStatus():void
  {
    this.stats = {...this.originalstats};
    this.resistance = {...this.originalResistance};
    for(const equipment of this.iterEquipment()){ equipment.applyModifiers(this);}
    for(const status of this.statuses.concat(this.timedStatus)){ status.applyEffect(this); }
  }
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
      if(removeItem(this.battleStatus, status))return status.onStatusRemoved(this);
      return [[],[]]
    }
    let removeStatusDescription: ActionOutput = [[],[]];
    let statusIndex = this.battleStatus.findIndex(characterStatus => (status===characterStatus.name));
    while (statusIndex >= 0)
    {
      const [statusRemoved] = this.battleStatus.splice(statusIndex, 1);
      removeStatusDescription = statusRemoved.onStatusRemoved(this);
      statusIndex = this.battleStatus.findIndex(characterStatus => (status===characterStatus.name));
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
      if(removeItem(this.timedStatus, status)) return status.onStatusRemoved(this);
      return [[],[]]
    }
    let removeStatusDescription: ActionOutput = [[],[]]
    let statusIndex = this.timedStatus.findIndex(characterStatus => (status === characterStatus.name));
    while (statusIndex >= 0)
    {
      const [statusRemoved] = this.timedStatus.splice(statusIndex, 1);
      removeStatusDescription = statusRemoved.onStatusRemoved(this);
      statusIndex = this.timedStatus.findIndex(characterStatus => (status === characterStatus.name));
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
      if(removeItem(this.statuses, status))return status.onStatusRemoved(this);
      return [[],[]]
    }
    let removeStatusDescription: ActionOutput = [[],[]]
    let statusIndex = this.statuses.findIndex(characterStatus => (status===characterStatus.name));
    while (statusIndex >= 0)
    {
      const [statusRemoved] = this.statuses.splice(statusIndex, 1);
      removeStatusDescription = statusRemoved.onStatusRemoved(this);
      statusIndex = this.statuses.findIndex(characterStatus => (status===characterStatus.name));
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
    this.battleStatus.push(status);
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
    this.timedStatus.push(status);
    pushBattleActionOutput(status.onStatusGainded(this),[statusDescription, statusString]);
    return [statusDescription, statusString];
  }
  /**
   * Pushes an array of Special Attack to another if not already present.
   *
   * @private
   * @param {SpecialAttack[]} specials The original array
   * @param {SpecialAttack[]} specials2push The array of specials that will be pushed.
   * @memberof Character
   */
  private pushSpecial(specials:SpecialAttack[],specials2push:SpecialAttack[])
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
   * @private
   * @param {Reaction[]} reactions The original array
   * @param {Reaction[]} reactions2push The array of reactions that will be pushed.
   * @memberof Character
   */
  private pushReactions(reactions:Reaction[],reactions2push:Reaction[])
  {
    for(const reaction of reactions2push)
    {
      if(reactions.some(pushed => pushed.constructor === reaction.constructor))continue;
      reactions.push(reaction);
    }
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
  private _useItem(itemIndexOrItem: number|GameItem,targets: Character[]):ActionOutput
  {
    let itemIndex:number;
    if(itemIndexOrItem instanceof GameItem)itemIndex = this.inventory.indexOf(itemIndexOrItem);
    else itemIndex = itemIndexOrItem;
    if(itemIndex < 0) return [[],[]]
    const item = this.inventory[itemIndex];
    const useItemDescription:ActionOutput =[[],[]]
    item.amount--;
    if (item.amount<=0)
    {
      const index = this.inventory.indexOf(item);
      this.inventory.splice(index,1);
    }
    for(const target of targets)
    { pushBattleActionOutput(item.itemEffect(this,target),useItemDescription) }
    return useItemDescription;
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
  private _useSpecialAttack(itemIndexOrItem: number|SpecialAttack,targets: Character[]):ActionOutput
  {
    let itemIndex:number;
    const characterSpecials = this.specialAttacks;
    if(itemIndexOrItem instanceof SpecialAttack)itemIndex = characterSpecials.indexOf(itemIndexOrItem);
    else itemIndex = itemIndexOrItem;
    if(itemIndex < 0) return [[],[]]
    const item = characterSpecials[itemIndex];
    const descriptions:Description[] = []
    const strings:string[] = []
    if(targets.length === 1)
    { pushBattleActionOutput(this.tryAttack(targets[0],(target: Character)=>item.itemEffect(this,target)),[descriptions,strings]) }
    else for(const target of targets)
    { pushBattleActionOutput(item.itemEffect(this,target),[descriptions,strings]) }
    return [descriptions,strings];
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
   * Check if the statusname is the same as the second argument.
   *
   * @private
   * @param {(string | Status)} status The status name to check.
   * @param {Status} characterStatus The status to check.
   * @return {*}
   * @memberof Character
   */
  private compareStatusName(status: string | Status, characterStatus: Status) {
    return (status instanceof Status && status.constructor === characterStatus.constructor) || characterStatus.name === status;
  }
  /**
   * The automatic action to perform.
   *
   * @abstract
   * @param {Character[]} ally The player party.
   * @param {Character[]} enemy The enemy party.
   * @return {*}  {ActionOutput}
   * @memberof Character
   */
  abstract IA_Action(ally: Character[], enemy: Character[]):ActionOutput;

  /**
   * Stores character type, originalstats, status, equipment,items and perks
   *
   * @return {*}  {{[key: string]:any}}
   * @memberof Character
   */
  toJson(): CharacterStoreable
  {
    const storeables:CharacterStoreable = {Factory:"Character", type:this.characterType};
    storeables['originalStats'] = {...this.coreStats, ...this.originalstats, ...this.originalResistance};
    storeables['currentCore']  = {...this.currentCoreStats}
    storeables['gold'] = this.gold;
    storeables['status'] = []
    for(const status of this.iterStatus())storeables['status'].push({name:status.name,options:status.toJson()})
    if(this._meleeWeapon)
      storeables['melee']  = {name:this._meleeWeapon.name,options:this._meleeWeapon.toJson()};
    if(this._rangedWeapon)
      storeables['ranged'] = {name:this._rangedWeapon.name,options:this._rangedWeapon.toJson()};
    if(this._armor)
      storeables['armor']  = {name:this._armor.name,options:this._armor.toJson()};
    if(this._shield)
      storeables['shield'] = {name:this._shield.name,options:this._shield.toJson()};
    storeables['inventory'] = []
    for(const item of this.inventory)storeables['inventory'].push({name:item.name,options:item.toJson()});
    storeables['perk'] = []
    for(const perk of this.perks)storeables['perk'].push({name:perk.name,options:perk.toJson()});
    return storeables
  }
  /**
   * loads originalstats, status, equipment,items and perks
   *
   * @param {{[key: string]: any}} options
   * @memberof Character
   */
  fromJson(options: CharacterStoreable): void
  {
    if(options['originalStats']) ({core:this.coreStats,physic:this.originalstats,resistance:this.originalResistance} = loadCharacterStats(options['originalStats']));
    if(options['currentCore'])this.currentCoreStats = {...options['currentCore']}
    if(options['gold']) this.gold = options['gold'];
    if(options['status'])for(const status of options['status']){ this.addStatus(StatusFactory(this.masterService,status.name,status.options))}
    (options['melee']) && (this._meleeWeapon=ItemFactory(this.masterService,options['melee'].name,options['melee'].options) as MeleeWeapon);
    (options['ranged'])&& (this._rangedWeapon=ItemFactory(this.masterService,options['ranged'].name,options['ranged'].options) as RangedWeapon);
    (options['armor']) && (this._armor=ItemFactory(this.masterService,options['armor'].name,options['armor'].options) as Armor);
    (options['shield'])&& (this._shield=ItemFactory(this.masterService,options['shield'].name,options['shield'].options) as Shield);
    if(options['inventory']) for(const item of options['inventory']){ this.addItem(ItemFactory(this.masterService,item.name,item.options)) };
    if(options['perk'])for(const perk of options['perk']){ this.addPerk(PerkFactory(this.masterService,perk.name,perk.options))};
    this.applyStatus();

  }
}
export type CharacterStoreable = {
  Factory:factoryname;
  type:characterType;
  originalStats?:coreStats&physicStats&resistanceStats;
  currentCore?:coreStats;
  gold?:number;
  status?:{name:statusname;options:StatusStoreable}[];
  melee?:{name:itemname;options:ItemStoreable};
  ranged?:{name:itemname;options:ItemStoreable};
  armor?:{name:itemname;options:ItemStoreable};
  shield?:{name:itemname;options:ItemStoreable};
  inventory?:{name:itemname;options:ItemStoreable}[];
  perk?:{name:perkname;options:PerkStoreable}[];
  [key: string]:any;
}

export interface coreStats      { hitpoints ?: number; energypoints ?: number;}
export interface physicStats    { attack ?: number; aim?: number; defence ?: number; speed ?: number; evasion ?: number;}
export interface resistanceStats{ heatresistance?: number; energyresistance?:number; frostresistance?:number; slashresistance?: number; bluntresistance?:number; pierceresistance?: number; poisonresistance ?: number;}
export type characterStats = coreStats&physicStats&resistanceStats;
export type ActionOutput = [Description[],string[]];
