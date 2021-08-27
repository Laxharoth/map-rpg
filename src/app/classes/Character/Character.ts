import { ActionOutput, characterStats } from "src/app/customTypes/customTypes";
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
import { RangedUnharmed } from "../Equipment/Weapon/Ranged/RangedUnharmed";
import { RangedWeapon } from "../Equipment/Weapon/Ranged/RangedWeapon";
import { Item } from "../Items/Item";
import { SpecialAttack } from "../Items/SpecialAttack/SpecialAttack";
import { MasterService } from "../masterService";
import { Perk } from "../Perk/Perk";
import { Reaction } from "./Reaction/Reaction";
import { Status } from "./Status/Status";
import { StatusFight } from "./Status/StatusFight";
import { StatusCharm } from "./Status/StatusTemporal/Ailments/StatusCharm";
import { StatusFright } from "./Status/StatusTemporal/Ailments/StatusFright";
import { StatusDefend } from "./Status/StatusTemporal/StatusDefend";
import { TimedStatus } from "./Status/TimedStatus";
import { StatusGrappling } from "./Status/StatusTemporal/Ailments/StatusGrappling";
import { StatusGrappled } from "./Status/StatusTemporal/Ailments/StatusGrappled";

export abstract class Character
{
    originalstats:characterStats;
    stats:characterStats;
    roundStats:characterStats;
    private perks:Perk[] = [];
    private statuses:Status[] = [];
    private timedStatus:TimedStatus[] = [];
    private fightStatus:StatusFight[] = [];
    inventary:Item[] = [];
    
    private _meleeWeapon:MeleeWeapon = null;
    get meleeWeapon():MeleeWeapon { return this._meleeWeapon || new MeleeUnharmed(this.masterService) }
    private _rangedWeapon:RangedWeapon = null;
    get rangedWeapon():RangedWeapon { return this._rangedWeapon || new RangedUnharmed(this.masterService) }
    private _armor:Armor = null;
    get armor():Armor { return this._armor || new ArmorNoArmor(this.masterService)}
    private _shield:Shield = null;
    get shield():Shield { return this._shield || new ShieldNoShield(this.masterService)}

    private readonly masterService:MasterService;

    constructor( originalstats:characterStats,
      statuses : Status[] = [] ,timedStatus: TimedStatus[],
      masterService:MasterService
      )
      {
      this.masterService = masterService;
      this.originalstats = loadCharacterStats(originalstats)
      this.stats = {...this.originalstats};
      this.statuses = statuses;
      this.timedStatus = timedStatus;
      this.applyStatus();
    }
    
    abstract get name(): string;

    Attack(targets:Character[]):ActionOutput
    {
      const attackDescription:ActionOutput = [[],[]];
      const weapon = this.meleeWeapon;
      if(this.hasTag('double attack'))
        for(const target of targets)
        { pushBattleActionOutput(this.tryAttack(target,(target: Character)=>weapon.attack(this,target)),attackDescription) }
      for(const target of targets)
      { pushBattleActionOutput(this.tryAttack(target,(target: Character)=>weapon.attack(this,target)),attackDescription) }
      return attackDescription;
    }
    Shoot(targets:Character[]):ActionOutput
    {
      const attackDescription:ActionOutput = [[],[]];
      const weapon = this.rangedWeapon;
      if(this.hasTag('double shoot'))
        for(const target of targets)
        { pushBattleActionOutput(this.tryAttack(target,(target: Character)=>weapon.attack(this,target)),attackDescription) }
      for(const target of targets)
      { pushBattleActionOutput(this.tryAttack(target,(target: Character)=>weapon.attack(this,target)),attackDescription) }
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
      ({...this.roundStats} = this.stats)
      pushBattleActionOutput(this.startRoundRemoveStatusFight(),roundDescription)
      pushBattleActionOutput(this.startRoundApplyStatus(),roundDescription)
      this.cooldownSpecials();
      return roundDescription;
    }
    onDefeated():ActionOutput
    {
      let description:ActionOutput =[[],[]]
      for(const status of this. fightStatus)
      { pushBattleActionOutput(status.onStatusRemoved(this),description) }
      this.fightStatus = [];
      return description;
    }

    protected startRoundRemoveStatusFight():ActionOutput
    {
      const removeStatusDescription:ActionOutput = [[],[]]
      const removeFightStatus = this.fightStatus.filter(ailment => ailment.effectHasEnded);
      this.fightStatus = this.fightStatus.filter(ailment => !ailment.effectHasEnded);
      for(const ended of removeFightStatus)
      { pushBattleActionOutput(ended.onStatusRemoved(this),removeStatusDescription) }
      return removeStatusDescription
    }
    p
    protected startRoundApplyStatus():ActionOutput
    {
      const statusDescription:ActionOutput = [[],[]]
      for(const status of this.fightStatus)
      { pushBattleActionOutput(status.applyEffect(this),statusDescription) }
      return statusDescription;
    }
    protected cooldownSpecials():void { for(const special of this.specialAttacks) special.cooldown = Math.max(0,special.cooldown-1) }

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

    protected get reactions(): Reaction[]
    { 
      const reactions: Reaction[] = []
      for(const equipment of this.iterEquipment()) { this.pushReactions(reactions,equipment.reactions) }
      for(const perk of this.perks){this.pushReactions(reactions,perk.reactions)}
      for(const status of this.iterStatus()){this.pushReactions(reactions,status.reactions)}
      return reactions;
    };
    private pushReactions(reactions:Reaction[],reactions2push:Reaction[])
    {
      for(const reaction of reactions2push)
      {
        if(reactions.some(pushed => pushed.constructor === reaction.constructor))continue;
        reactions.push(reaction);
      }
    }
    get specialAttacks(): SpecialAttack[]
    { 
      const specials: SpecialAttack[] = []
      for(const equipment of this.iterEquipment()) { this.pushSpecial(specials,equipment.specials) }
      for(const perk of this.perks){this.pushSpecial(specials,perk.specials)}
      for(const status of this.iterStatus()){this.pushSpecial(specials,status.specials)}
      return specials
    };
    private pushSpecial(specials:SpecialAttack[],specials2push:SpecialAttack[])
    {
      for(const special of specials2push)
      {
        if(specials.some(pushed => pushed.constructor === special.constructor))continue;
        specials.push(special);
      }
    }

    protected get tags():tag[]
    {
      const tags:tag[] = [];
      for(const equipment of this.iterEquipment()) tags.push(...equipment.tags)
      for(const status of this.iterStatus())tags.push(...status.tags)
      for(const perk of this.perks)tags.push(...perk.tags)
      return tags;
    }

    hasTag(tag:tag):boolean { return this.tags.includes(tag); }
    
    addStatus(status: Status): ActionOutput{
      if(!status.canApply(this))return [[], [`${this.name} resisted ${status.name}`]];
      const statusDescription:ActionOutput = [[],[]]
      if(status instanceof StatusFight){pushBattleActionOutput(this.addFightStatus(status),statusDescription)}
      else if(status instanceof TimedStatus){pushBattleActionOutput(this.addTimedStatus(status),statusDescription)}
      else{
        this.statuses.push(status);
        pushBattleActionOutput(status.onStatusGainded(this),statusDescription)
      }
      return statusDescription;
    }
    private addFightStatus(status: StatusFight): ActionOutput {
      const statusDescription:ActionOutput = [[],[]]
      this.fightStatus.push(status);
      pushBattleActionOutput(status.onStatusGainded(this),statusDescription)
      return statusDescription;
    }
    private addTimedStatus(status: TimedStatus): ActionOutput {
      const [statusDescription, statusString]:ActionOutput = [[],[]];
      this.timedStatus.push(status);
      pushBattleActionOutput(status.onStatusGainded(this),[statusDescription, statusString]);
      return [statusDescription, statusString];
    }
    addPerk(perk:Perk):void
    {
      if(this.perks.some(characterperk => characterperk.constructor ===  perk.constructor))return;
      this.perks.push(perk);
    }
    removeStatus(status:Status|statusname):ActionOutput
    {
      let removeStatusDescription:ActionOutput = [[],[]];
      let statusIndex = this.statuses.findIndex(characterStatus=>characterStatus.toString()===status.toString());
      while(statusIndex>=0)
      {
        const [status] = this.statuses.splice(statusIndex,1);
        removeStatusDescription = status.onStatusRemoved(this);
        statusIndex = this.statuses.findIndex(characterStatus=>characterStatus.toString()===status.toString())
      }
      statusIndex = this.timedStatus.findIndex(characterStatus=>characterStatus.toString()===status.toString());
      while(statusIndex>=0)
      {
        const [status] = this.timedStatus.splice(statusIndex,1);
        removeStatusDescription = status.onStatusRemoved(this);
        statusIndex = this.timedStatus.findIndex(characterStatus=>characterStatus.toString()===status.toString())
      }
      statusIndex = this.fightStatus.findIndex(characterStatus=>characterStatus.toString()===status.toString());
      while(statusIndex>=0)
      {
        const [status] = this.fightStatus.splice(statusIndex,1);
        removeStatusDescription = status.onStatusRemoved(this);
        statusIndex = this.fightStatus.findIndex(characterStatus=>characterStatus.toString()===status.toString())
      }
      this.applyStatus();
      return removeStatusDescription;
    }
    getStatus(status: statusname):Status|null{
      for(const characterStatus of this.iterStatus())if(characterStatus.toString()===status.toString())return characterStatus;
      return null;
    }
    tryAttack(target:Character , action:(target:Character)=>ActionOutput):ActionOutput
    {
      for(const tag of this.tags)
      {
        if(tag==='paralized') return [[],[`${this.name} is paralized and can't move`]]
      }
      for(const status of this.iterStatus())
      {
        if(status instanceof StatusCharm      && !(status as StatusCharm)?.canAttack?.(target)   ) return [[],[`${this.name} is charmed and can't attack ${target.name}`]]
        if(status instanceof StatusFright     && !(status as StatusFright)?.canAttack?.(target)  ) return [[],[`${this.name} fears ${target.name} and can't act.`]]
        if(status instanceof StatusGrappled   && !(status as StatusGrappled)?.canAttack?.(target)) return [[],[`${this.name} can attack only the grapping one.`]]
        if(status instanceof StatusGrappling  && !(status as StatusGrappling)?.canAttack?.(target))return [[],[`${this.name} can attack only the grapped one.`]]
      }
      return  action(target);
    }
    removeTimedStatus():ActionOutput
    {
      const statusDescription:Description[]=[]
      const statusString:string[]=[]
      const removeStatus = this.timedStatus.filter(status => status.effectHasEnded);
      this.timedStatus   = this.timedStatus.filter(status => !status.effectHasEnded);
      for(const ended of removeStatus)
      { pushBattleActionOutput(ended.onStatusRemoved(this),[statusDescription,statusString]) }
      return [statusDescription, statusString];
    }
    addItem(item:Item):ActionOutput
    {
      throw Error('addItem')
    }
    useItem(itemIndex: number,targets: Character[]):ActionOutput
    {
      const item = this.inventary[itemIndex];
      if(item instanceof Equipment)
      {
        const removedItem = this.Equip(item)
        return this.addItem(removedItem);
      }
      const useItemDescription:ActionOutput =[[],[]]
      for(const target of targets)
      { pushBattleActionOutput(item.itemEffect(this,target),useItemDescription) }
      return useItemDescription;
    }
    useSpecialAttack(itemIndex: number,targets: Character[]):ActionOutput
    {
      const item = this.specialAttacks[itemIndex];
      const descriptions:Description[] = []
      const strings:string[] = []
      if(targets.length === 1)
      { pushBattleActionOutput(this.tryAttack(targets[0],(target: Character)=>item.itemEffect(this,target)),[descriptions,strings]) }
      else for(const target of targets)
      { pushBattleActionOutput(item.itemEffect(this,target),[descriptions,strings]) }
      return [descriptions,strings];
    }
    private Equip(equipment:Equipment):Item
    {
      let removedEquipment:Equipment;
      if(equipment instanceof MeleeWeapon){}
      if(equipment instanceof RangedWeapon){}
      if(equipment instanceof Armor){}
      if(equipment instanceof Shield){}
      return removedEquipment;
    }
    private applyStatus():void
    {
      const {hitpoints:currentlife=this.originalstats.hitpoints,energypoints:currentenergy=this.originalstats.energypoints} = this.stats;
      ({...this.stats} = this.originalstats)
      this.stats.hitpoints = currentlife;
      this.stats.energypoints = currentenergy;
      for(const equipment of this.iterEquipment())
      { equipment.applyModifiers(this); }
      for(const status of this.statuses.concat(this.timedStatus))
      { status.applyEffect(this); }
    }

    private iterEquipment = function*():Generator<Equipment, void, unknown>
                            {
                              yield this.meleeWeapon;
                              yield this.rangedWeapon;
                              yield this.armor;
                              yield this.shield;
                            }
    private iterStatus    = function*():Generator<Status, void,unknown>
                            {
                              for(const status of this.statuses) yield status;
                              for(const status of this.timedStatus) yield status;
                              for(const status of this.fightStatus) yield status;
                            }
    abstract IA_Action(ally: Character[], enemy: Character[]):ActionOutput;

    react(whatTriggers:tag[],source: Character):ActionOutput
    {
      const reactDescription:ActionOutput = [[],[]]
      if(this.hasTag('paralized') || this.stats.hitpoints<=0) return reactDescription;
      for(const reaction of this.reactions)
      { pushBattleActionOutput(reaction.reaction(whatTriggers,source,this),reactDescription); console.log(reactDescription) }
      return reactDescription
    }

    get currentStatusString():string { return `${this.name} looks like they are ${this.stats.hitpoints} in a scale of 0 to ${this.originalstats.hitpoints}`}
}
