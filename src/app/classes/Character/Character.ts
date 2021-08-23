import { battleActionOutput, characterStats } from "src/app/customTypes/customTypes";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
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
import { StatusDefend } from "./Status/StatusTemporal/StatusDefend";
import { TimedStatus } from "./Status/TimedStatus";

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
    specialAttacks:SpecialAttack[] = [];
    protected abstract reactions:Reaction[];

    private _meleeWeapon:MeleeWeapon = null;
    get meleeWeapon():MeleeWeapon { return this._meleeWeapon || new MeleeUnharmed(this.masterService) }
    private _rangedWeapon:RangedWeapon = null;
    get rangedWeapon():RangedWeapon { return this._rangedWeapon || new RangedUnharmed(this.masterService) }
    private _armor:Armor = null;
    get armor():Armor { return this._armor || new ArmorNoArmor(this.masterService)}
    private _shield:Shield = null;
    get shield():Shield { return this._shield || new ShieldNoShield(this.masterService)}

    private readonly masterService:MasterService;

    constructor( hitpoints : number, energypoints : number, attack : number, defence : number, speed : number,
      aim:number, evasion:number, 
      heatresistance:number, energyresistance:number,frostresistance:number, slashresistance:number, bluntresistance:number, pierceresistance:number, poisonresistance:number,
      statuses : Status[] = [] ,timedStatus: TimedStatus[],
      masterService:MasterService
      )
      {
      this.masterService = masterService;
      this.originalstats= {
        hitpoints : hitpoints,
        energypoints : energypoints,
        attack  : attack,
        defence :defence,
        speed   : speed,
        aim:aim, 
        evasion:evasion, 
        heatresistance:heatresistance, 
        energyresistance:energyresistance,
        frostresistance:frostresistance,
        slashresistance:slashresistance,
        bluntresistance:bluntresistance,
        pierceresistance:pierceresistance,
        poisonresistance:poisonresistance
      }
      this.stats = {...this.originalstats};
      this.statuses = statuses;
      this.timedStatus = timedStatus;
      this.applyStatus();
    }
    
    abstract get name(): string;

    Attack(targets:Character[]):battleActionOutput
    {
      const [attackDescription, attackString]:battleActionOutput = [[],[]];
      const weapon = this.meleeWeapon;
      for(const target of targets)
      { pushBattleActionOutput(weapon.attack(this,target),[attackDescription, attackString]) }
      return [attackDescription, attackString];
    }
    Shoot(targets:Character[]):battleActionOutput
    {
      const [attackDescription, attackString]:battleActionOutput = [[],[]];
      const weapon = this.rangedWeapon;
      for(const target of targets)
      { pushBattleActionOutput(weapon.attack(this,target),[attackDescription, attackString]) }
      return [attackDescription, attackString];
    }
    Defend(target:Character[]):battleActionOutput
    {
      const status = new StatusDefend(this.masterService)
      this.addStatus(status);
      this.react(this.shield.tags,this);
      return status.applyEffect(this);
    }
    startRound():battleActionOutput
    {
      const roundString:string[]=[];
      const roundDescription:Description[]=[];
      roundString.push(this.currentStatusString);
      ({...this.roundStats} = this.stats)
      const removeAilments = this.fightStatus.filter(ailment => ailment.effectHasEnded);
      this.fightStatus = this.fightStatus.filter(ailment => !ailment.effectHasEnded);
      for(const ended of removeAilments)
      { pushBattleActionOutput(ended.onEffectEnded(this),[roundDescription, roundString]) }
      for(const status of this.fightStatus)
      { pushBattleActionOutput(status.applyEffect(this),[roundDescription, roundString]) }
      for(const special of this.specialAttacks)
      { special.cooldown = Math.max(0,special.cooldown-1) }
      return [roundDescription,roundString];
    }

    /**
     * Gets the number of instances of a specific status in the character
     * @param status The name of the status to check
     * @returns The number of instance of the status applied
     */
    hasStatus(status:Status|string):number
    {
      let timesFound = 0;
      for(const charStatus of this.iterStatus()) 
        if(charStatus.toString()===status.toString()) 
          timesFound++;
      return timesFound;
    }

    get tags():tag[]
    {
      const tags:tag[] = [];
      for(const equipment of this.iterEquipment()) tags.push(...equipment.tags)
      for(const status of this.iterStatus())tags.push(...status.tags)
      for(const perk of this.perks)tags.push(...perk.tags)
      return tags
    }

    hasTag(tag:tag):boolean
    {
      return this.tags.includes(tag);
    }
    addStatus(status: Status): battleActionOutput{
      if(status instanceof StatusFight)return this.addFightStatus(status)
      if(status instanceof TimedStatus)return this.addTimedStatus(status)
      const [statusDescription=[], statusString=[]] = []
      this.statuses.push(status);
      pushBattleActionOutput(status.onStatusGainded(this),[statusDescription, statusString])
      return [statusDescription, statusString];
    }
    private addFightStatus(status: StatusFight): battleActionOutput {
      const statusDescription:Description[] = []
      const statusString:string[] = []
      this.fightStatus.push(status);
      pushBattleActionOutput(status.onStatusGainded(this),[statusDescription, statusString])
      return [statusDescription,statusString];
    }
    private addTimedStatus(status: TimedStatus): battleActionOutput {
      const [statusDescription, statusString]:battleActionOutput = [[],[]];
      this.timedStatus.push(status);
      pushBattleActionOutput(status.onStatusGainded(this),[statusDescription, statusString]);
      return [statusDescription, statusString];
    }
    removeStatus(status:Status|string):battleActionOutput
    {
      let [descriptions,strings]:battleActionOutput = [[],[]];
      let statusIndex = this.statuses.findIndex(characterStatus=>characterStatus.toString()===status.toString());
      while(statusIndex>=0)
      {
        const [status] = this.statuses.splice(statusIndex,1);
        [descriptions,strings] = status.onEffectEnded(this);
        statusIndex = this.statuses.findIndex(characterStatus=>characterStatus.toString()===status.toString())
      }
      this.applyStatus();
      return [descriptions,strings];
    }
    removeTimedStatus():battleActionOutput
    {
      const statusDescription:Description[]=[]
      const statusString:string[]=[]
      const removeStatus = this.timedStatus.filter(status => status.effectHasEnded);
      this.timedStatus   = this.timedStatus.filter(status => !status.effectHasEnded);
      for(const ended of removeStatus)
      { pushBattleActionOutput(ended.onEffectEnded(),[statusDescription,statusString]) }
      return [statusDescription, statusString];
    }
    addItem(item:Item):battleActionOutput
    {
      throw Error('addItem')
    }
    addSpecialAttack(specialAttack:SpecialAttack):void
    {
      if(this.specialAttacks.some(attack=>attack.toString()===specialAttack.toString()))return;
      this.specialAttacks.push(specialAttack);
    }
    useItem(itemIndex: number,targets: Character[]):battleActionOutput
    {
      const item = this.inventary[itemIndex];
      if(item instanceof Equipment)
      {
        const removedItem = this.Equip(item)
        return this.addItem(removedItem);
      }
      const descriptions:Description[] = []
      const strings:string[] = []
      for(const target of targets)
      { pushBattleActionOutput(item.itemEffect(this,target),[descriptions,strings]) }
      return [descriptions,strings];
    }
    useSpecialAttack(itemIndex: number,targets: Character[]):battleActionOutput
    {
      const item = this.specialAttacks[itemIndex];
      const descriptions:Description[] = []
      const strings:string[] = []
      for(const target of targets)
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
    abstract IA_Action(ally: Character[], enemy: Character[]):battleActionOutput;

    react(whatTriggers:tag[],source: Character):battleActionOutput
    {
      const reactionDescriptions:Description[] = []
      const reactionStrings:string[] = []
      for(const reaction of this.reactions)
      { pushBattleActionOutput(reaction.reaction(whatTriggers,source,this),[reactionDescriptions,reactionStrings]) }
      return [reactionDescriptions,reactionStrings]
    }

    get currentStatusString():string { return `${this.name} looks like they are ${this.stats.hitpoints} in a scale of 0 to ${this.originalstats.hitpoints}`}
}
