import { ActionOutput, characterStats, storeable } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { loadCharacterStats, pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Description } from "../Descriptions/Description";
import { Armor } from "../Equipment/Armor/Armor";
import { ArmorNoArmor } from "../Equipment/Armor/ArmorNoArmor";
import { Equipment } from "../Equipment/Equipment";
import { Shield } from "../Equipment/Shield/Shield";
import { ShieldNoShield } from "../Equipment/Shield/ShieldNoShield";
import { MeleeUnharmed } from "../Equipment/Weapon/Melee/MeleeUnharmed";
import { MeleeWeapon } from "../Equipment/Weapon/Melee/MeleeWeapon";
import { RangedWeapon } from "../Equipment/Weapon/Ranged/RangedWeapon";
import { Item } from "../Items/Item";
import { SpecialAttack } from "../Items/SpecialAttack/SpecialAttack";
import { MasterService } from "../masterService";
import { Perk } from "../Perk/Perk";
import { Reaction } from "./Reaction/Reaction";
import { Status } from "./Status/Status";
import { StatusBattle } from "./Status/StatusBattle";
import { StatusCharm } from "./Status/StatusTemporal/Ailments/StatusCharm";
import { StatusFright } from "./Status/StatusTemporal/Ailments/StatusFright";
import { StatusDefend } from "./Status/StatusTemporal/StatusDefend";
import { TimedStatus } from "./Status/TimedStatus";
import { StatusGrappling } from "./Status/StatusTemporal/Ailments/StatusGrappling";
import { StatusGrappled } from "./Status/StatusTemporal/Ailments/StatusGrappled";
import { RangedUnharmed } from "../Equipment/Weapon/Ranged/RangedUnharmed";
import { AddExceedItem } from "../Descriptions/DescriptionAddExceedItem";
import { Weapon } from "../Equipment/Weapon/Weapon";
import { StatusFactory } from "./Factory/StatusFactory";
import { ItemFactory } from "./Factory/ItemFactory";
import { PerkFactory } from "./Factory/PerkFactory";
import { characterType } from "src/app/customTypes/characterTypes";

export abstract class Character implements storeable
{
  originalstats:characterStats;
  stats:characterStats;
  roundStats:characterStats;
  private perks:Perk[] = [];
  private statuses:Status[] = [];
  private timedStatus:TimedStatus[] = [];
  private battleStatus:StatusBattle[] = [];
  abstract readonly characterType:characterType;
  inventarysize = 9;
  inventary:Item[] = [];

  private static __meleeUnharmed__:MeleeUnharmed;
  private static __rangedUnharmed__:RangedUnharmed;
  private static __noArmor__:ArmorNoArmor;
  private static __noShield__:ShieldNoShield;

  private _meleeWeapon:MeleeWeapon = null;
  get meleeWeapon():MeleeWeapon { return this._meleeWeapon || Character.__meleeUnharmed__ }
  set meleeWeapon(equipment:MeleeWeapon){this._meleeWeapon=equipment}
  private _rangedWeapon:RangedWeapon = null;
  get rangedWeapon():RangedWeapon { return this._rangedWeapon || Character.__rangedUnharmed__ }
  set rangedWeapon(equipment:RangedWeapon){this._rangedWeapon=equipment}
  private _armor:Armor = null;
  get armor():Armor { return this._armor || Character.__noArmor__}
  set armor(equipment:Armor){this._armor=equipment}
  private _shield:Shield = null;
  get shield():Shield { return this._shield || Character.__noShield__}
  set shield(equipment:Shield){this._shield=equipment}

  abstract get name(): string;
  private readonly masterService:MasterService
  private __endbattle__ = false;

  constructor( originalstats:characterStats,
    masterService:MasterService)
  {
    this.masterService = masterService;
    this.originalstats = loadCharacterStats(originalstats)
    this.stats = {...this.originalstats};
    this.initializeUnharmed();
    this.applyStatus();
  }
  Attack(targets:Character[]):ActionOutput
  {
    const attackDescription:ActionOutput = [[],[]];
    const weapon = this.meleeWeapon;
    if(this.hasTag('double attack'))
      this.attackWithWeapon(targets, weapon, attackDescription);
    this.attackWithWeapon(targets, weapon, attackDescription);
    return attackDescription;
  }
  Shoot(targets:Character[]):ActionOutput
  {
    const attackDescription:ActionOutput = [[],[]];
    const weapon = this.rangedWeapon;
    if(this.hasTag('double shoot'))
      this.attackWithWeapon(targets, weapon, attackDescription);
    this.attackWithWeapon(targets, weapon, attackDescription);
    return attackDescription;
  }
  Defend(target:Character[]):ActionOutput
  {
    const status = new StatusDefend(this.masterService)
    this.addStatus(status);
    const reactionOutput = this.react(this.shield.tags,this);
    const statusOutput  = status.applyEffect(this);
    return pushBattleActionOutput(statusOutput,reactionOutput);
  }
  startRound():ActionOutput
  {
    const roundDescription:ActionOutput = [[],[]]
    roundDescription[1].push(this.currentStatusString);
    this.roundStats = {...this.stats}
    pushBattleActionOutput(this.startRoundRemoveStatusBattle(),roundDescription)
    pushBattleActionOutput(this.startRoundApplyStatus(),roundDescription)
    this.cooldownSpecials();
    return roundDescription;
  }
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
      if(characterStatus.toString()===status.toString())
        timesFound++;
    return timesFound;
  }

  get specialAttacks(): SpecialAttack[]
  {
    const specials: SpecialAttack[] = []
    for(const equipment of this.iterEquipment()) { this.pushSpecial(specials,equipment.specials) }
    for(const perk of this.perks){this.pushSpecial(specials,perk.specials)}
    for(const status of this.iterStatus()){this.pushSpecial(specials,status.specials)}
    return specials
  };

  hasTag(tag:tag):boolean { return this.tags.includes(tag); }

  addStatus(status: Status): ActionOutput{
    if(!status.canApply(this))return [[], [`${this.name} resisted ${status.name}`]];
    if(status instanceof StatusBattle)return this.addBattleStatus(status)
    else if(status instanceof TimedStatus)return this.addTimedStatus(status);
    this.statuses.push(status);
    return status.onStatusGainded(this)
  }
  addPerk(perk:Perk):void
  {
    if(this.perks.some(characterperk => characterperk.constructor ===  perk.constructor))return;
    this.perks.push(perk);
  }
  removeStatus(status:Status|statusname):ActionOutput
  {
    let removeStatusDescription:ActionOutput = [[],[]];
    pushBattleActionOutput(this.removeRegularStatus(status),removeStatusDescription);
    pushBattleActionOutput(this.removeTimedStatus(  status),removeStatusDescription);
    pushBattleActionOutput(this.removeBattleStatus( status),removeStatusDescription);
    this.applyStatus();
    return removeStatusDescription;
  }
  getStatus(status: statusname):Status|null{
    for(const characterStatus of this.iterStatus())if(characterStatus.toString()===status.toString())return characterStatus;
    return null;
  }
  tryAttack(target:Character , action:(target:Character)=>ActionOutput):ActionOutput
  {
    if(this.hasTag('paralized')) return [[],[`${this.name} is paralized and can't move`]];
    for(const status of this.iterStatus())
    {
      if(status instanceof StatusCharm      && !(status as StatusCharm)?.canAttack?.(target)   ) return [[],[`${this.name} is charmed and can't attack ${target.name}`]];
      if(status instanceof StatusFright     && !(status as StatusFright)?.canAttack?.(target)  ) return [[],[`${this.name} fears ${target.name} and can't act.`]];
      if(status instanceof StatusGrappled   && !(status as StatusGrappled)?.canAttack?.(target)) return [[],[`${this.name} can attack only the grapping one.`]];
      if(status instanceof StatusGrappling  && !(status as StatusGrappling)?.canAttack?.(target))return [[],[`${this.name} can attack only the grapped one.`]];
    }
    return  action(target);
  }
  addItem(item:Item):ActionOutput
  {
    if(!item){console.warn("Item not found, Is null or undefined."); return [[],[]];}
    if(item.amount === 0) return [[],[]];
    this.fitItemIntoInventary(item);
    if(item.amount > 0 && this.inventary.length < this.inventarysize)
    {
      this.inventary.push(item);
      return [[],[]];
    }
    return [[AddExceedItem(this.masterService,item,this)],[]];
  }
  useItem(itemIndexOrItem: number|Item|SpecialAttack,targets: Character[],sourceItem:'inventary'|'special'=null):ActionOutput
  {
    if(itemIndexOrItem instanceof SpecialAttack)return this._useSpecialAttack(itemIndexOrItem,targets);
    if(itemIndexOrItem instanceof Item)return this._useItem(itemIndexOrItem,targets);
    if(sourceItem === 'special')return this._useSpecialAttack(itemIndexOrItem,targets);
    if(sourceItem === 'inventary')return this._useItem(itemIndexOrItem,targets);
    console.warn('item instance not provided or source not provided')
    return [[],[]]
  }
  unequipMelee():ActionOutput
  {
    const melee = this._meleeWeapon;
    if(melee)melee.amount++
    this._meleeWeapon = null;
    return this.addItem(melee);
  }
  unequipRanged():ActionOutput
  {
    const ranged = this._rangedWeapon;
    if(ranged)ranged.amount++;
    this._rangedWeapon = null;
    return this.addItem(ranged);
  }
  unequipArmor():ActionOutput
  {
    const armor = this._armor;
    if(armor)armor.amount++;
    this._armor = null;
    return this.addItem(armor);
  }
  unequipShield():ActionOutput
  {
    const shield = this._shield;
    if(shield)shield.amount++;
    this._shield = null;
    return this.addItem(shield);
  }

  iterEquipment = function*():Generator<Equipment, void, unknown>
                  {
                    yield this.meleeWeapon;
                    yield this.rangedWeapon;
                    yield this.armor;
                    yield this.shield;
                  }
  iterStatus    = function*():Generator<Status, void,unknown>
                  {
                    for(const status of this.statuses) yield status;
                    for(const status of this.timedStatus) yield status;
                    for(const status of this.battleStatus) yield status;
                  }

  react(whatTriggers:tag[],source: Character):ActionOutput
  {
    const reactDescription:ActionOutput = [[],[]]
    if( this.hasTag('paralized') ||
        this.stats.hitpoints<=0  ||
        this.__endbattle__         )
      return reactDescription;
    for(const reaction of this.reactions){ pushBattleActionOutput(reaction.reaction(whatTriggers,source,this),reactDescription);}
    return reactDescription
  }
  takeDamage(damage:number)
  {
    this.stats.hitpoints=Math.max(0,this.stats.hitpoints-damage);
    this.masterService.updateCharacter(this);
  }
  healHitPoints(hitpointsgain:number)
  {
    this.stats.hitpoints=Math.min(this.originalstats.hitpoints,this.stats.hitpoints+hitpointsgain);
    this.masterService.updateCharacter(this);
  }

  get currentStatusString():string { return `${this.name} looks like they are ${this.stats.hitpoints} in a scale of 0 to ${this.originalstats.hitpoints}`}

  onEndBattle():void
  {
    const removeStatus = this.battleStatus
    this.battleStatus = [];
    this.__endbattle__ = true;
    for(const status of removeStatus)status.onStatusRemoved(this);
    this.__endbattle__ = false;
  }

  protected startRoundRemoveStatusBattle():ActionOutput
  {
    const removeStatusDescription:ActionOutput = [[],[]]
    const keepStatus:StatusBattle[] = [];
    for(const status of this.battleStatus)
    {
      if(status.effectHasEnded)pushBattleActionOutput(status.onStatusRemoved(this),removeStatusDescription)
      else keepStatus.push(status);
    }
    this.battleStatus = keepStatus;
    return removeStatusDescription
  }
  protected get reactions(): Reaction[]
  {
    const reactions: Reaction[] = []
    for(const equipment of this.iterEquipment()) { this.pushReactions(reactions,equipment.reactions) }
    for(const perk of this.perks){this.pushReactions(reactions,perk.reactions)}
    for(const status of this.iterStatus()){this.pushReactions(reactions,status.reactions)}
    return reactions;
  };
  protected get tags():tag[]
  {
    const tags:tag[] = [];
    for(const equipment of this.iterEquipment()) tags.push(...equipment.tags)
    for(const status of this.iterStatus())tags.push(...status.tags)
    for(const perk of this.perks)tags.push(...perk.tags)
    return tags;
  }
  protected startRoundApplyStatus():ActionOutput
  {
    const statusDescription:ActionOutput = [[],[]]
    for(const status of this.battleStatus)
    { pushBattleActionOutput(status.applyEffect(this),statusDescription) }
    return statusDescription;
  }
  protected cooldownSpecials():void { for(const special of this.specialAttacks) special.cooldown = Math.max(0,special.cooldown-1) }

  private applyStatus():void
  {
    const {hitpoints:currentlife=this.originalstats.hitpoints,energypoints:currentenergy=this.originalstats.energypoints} = this.stats;
    this.stats = {...this.originalstats}
    this.stats.hitpoints = currentlife;
    this.stats.energypoints = currentenergy;
    for(const equipment of this.iterEquipment()){ equipment.applyModifiers(this); }
    for(const status of this.statuses.concat(this.timedStatus)){ status.applyEffect(this); }
  }
  private fitItemIntoInventary(item: Item)
  {
    for (const characteritem of this.inventary)
    {
      if (characteritem.constructor === item.constructor)
      {
        const characteriteramount = characteritem.amount;
        const itemamount = characteritem.amount;
        const newcharacteritemamount = Math.min(characteriteramount + itemamount, item.maxStack);
        const newitemamount = itemamount - (newcharacteritemamount - characteriteramount);
        characteritem.amount = newcharacteritemamount;
        item.amount = newitemamount;
      }
    }
  }
  private removeBattleStatus(status: string | Status)
  {
    let removeStatusDescription: ActionOutput = [[],[]];
    let statusIndex = this.battleStatus.findIndex(characterStatus => characterStatus.toString() === status.toString());
    while (statusIndex >= 0)
    {
      const [status] = this.battleStatus.splice(statusIndex, 1);
      removeStatusDescription = status.onStatusRemoved(this);
      statusIndex = this.battleStatus.findIndex(characterStatus => characterStatus.toString() === status.toString());
    }
    return removeStatusDescription ;
  }
  private removeTimedStatus(status: string | Status)
  {
    let removeStatusDescription: ActionOutput = [[],[]]
    let statusIndex = this.timedStatus.findIndex(characterStatus => characterStatus.toString() === status.toString());
    while (statusIndex >= 0)
    {
      const [status] = this.timedStatus.splice(statusIndex, 1);
      removeStatusDescription = status.onStatusRemoved(this);
      statusIndex = this.timedStatus.findIndex(characterStatus => characterStatus.toString() === status.toString());
    }
    return removeStatusDescription ;
  }
  private removeRegularStatus(status: string | Status)
  {
    let removeStatusDescription: ActionOutput = [[],[]]
    let statusIndex = this.statuses.findIndex(characterStatus => characterStatus.toString() === status.toString());
    while (statusIndex >= 0)
    {
      const [status] = this.statuses.splice(statusIndex, 1);
      removeStatusDescription = status.onStatusRemoved(this);
      statusIndex = this.statuses.findIndex(characterStatus => characterStatus.toString() === status.toString());
    }
    return removeStatusDescription ;
  }
  private addBattleStatus(status: StatusBattle): ActionOutput
  {
    const statusDescription:ActionOutput = [[],[]]
    this.battleStatus.push(status);
    pushBattleActionOutput(status.onStatusGainded(this),statusDescription)
    return statusDescription;
  }
  private addTimedStatus(status: TimedStatus): ActionOutput
  {
    const [statusDescription, statusString]:ActionOutput = [[],[]];
    this.timedStatus.push(status);
    pushBattleActionOutput(status.onStatusGainded(this),[statusDescription, statusString]);
    return [statusDescription, statusString];
  }
  private pushSpecial(specials:SpecialAttack[],specials2push:SpecialAttack[])
  {
    for(const special of specials2push)
    {
      if(specials.some(pushed => pushed.constructor === special.constructor))continue;
      specials.push(special);
    }
  }
  private pushReactions(reactions:Reaction[],reactions2push:Reaction[])
  {
    for(const reaction of reactions2push)
    {
      if(reactions.some(pushed => pushed.constructor === reaction.constructor))continue;
      reactions.push(reaction);
    }
  }
  private _useItem(itemIndexOrItem: number|Item,targets: Character[]):ActionOutput
  {
    let itemIndex:number;
    if(itemIndexOrItem instanceof Item)itemIndex = this.inventary.indexOf(itemIndexOrItem);
    else itemIndex = itemIndexOrItem;
    if(itemIndex < 0) return [[],[]]
    const item = this.inventary[itemIndex];
    const useItemDescription:ActionOutput =[[],[]]
    item.amount--;
    if (item.amount<=0)
    {
      const index = this.inventary.indexOf(item);
      this.inventary.splice(index,1);
    }
    for(const target of targets)
    { pushBattleActionOutput(item.itemEffect(this,target),useItemDescription) }
    return useItemDescription;
  }
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
  private initializeUnharmed() {
    if(!Character.__meleeUnharmed__)
    {
      Character.__meleeUnharmed__   = new MeleeUnharmed(this.masterService);
      Character.__rangedUnharmed__  = new RangedUnharmed(this.masterService);
      Character.__noArmor__         = new ArmorNoArmor(this.masterService);
      Character.__noShield__        = new ShieldNoShield(this.masterService);
    }
  }
  private attackWithWeapon(targets: Character[], weapon: Weapon, attackDescription: ActionOutput) {
    for (const target of targets) pushBattleActionOutput(this.tryAttack(target, (target: Character) => weapon.attack(this, target)), attackDescription);
  }
  abstract IA_Action(ally: Character[], enemy: Character[]):ActionOutput;
  toJson(): {[key: string]:any}
  {
    const storeables = {};
    storeables['type'] = this.characterType;
    storeables['originalStats'] = {...this.originalstats};
    storeables['status']  = this.statuses.map(status => { return {name:status.name,options:status.toJson() } })
                    .concat(this.battleStatus.map(status => { return {name:status.name,options:status.toJson() } }));
    if(this._meleeWeapon)
      storeables['melee']  = {name:this._meleeWeapon.name,options:this._meleeWeapon.toJson()};
    if(this._rangedWeapon)
      storeables['ranged'] = {name:this._rangedWeapon.name,options:this._rangedWeapon.toJson()};
    if(this._armor)
      storeables['armor']  = {name:this._armor.name,options:this._armor.toJson()};
    if(this._shield)
      storeables['shield'] = {name:this._shield.name,options:this._shield.toJson()};
    storeables['inventary'] = []
    for(const item of this.inventary)storeables['inventary'].push({name:item.name,options:item.toJson()});
    storeables['perk'] = []
    for(const perk of this.perks)storeables['perk'].push({name:perk.name,options:perk.toJson()});
    return storeables
  }
  fromJson(options: {[key: string]: any}): void
  {
    this.originalstats = {...options['originalstats']};
    for(const status of options['status']){ this.addStatus(StatusFactory(this.masterService,status.name,status.options))}
    if(options['melee'])
      this._meleeWeapon = ItemFactory(this.masterService,options['melee'].name,options['melee'].options) as MeleeWeapon
    if(options['ranged'])
      this._rangedWeapon= ItemFactory(this.masterService,options['ranged'].name,options['ranged'].options) as RangedWeapon
    if(options['armor'])
      this._armor       = ItemFactory(this.masterService,options['armor'].name,options['armor'].options) as Armor
    if(options['shield'])
      this._shield      = ItemFactory(this.masterService,options['shield'].name,options['shield'].options) as Shield
    for(const item of options['inventary']){ this.addItem(ItemFactory(this.masterService,item.name,item.options)) }
    for(const perk of options['perk']){ this.addPerk(PerkFactory(this.masterService,perk.name,perk.options)) }
    this.applyStatus();
  }
}
