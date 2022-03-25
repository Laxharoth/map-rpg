import { MasterService } from "src/app/service/master.service";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, CalculatedStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Reaction } from 'src/gameLogic/custom/Class/Character/Reaction/Reaction';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { equipmentname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { Int, roundToInt } from "../../ClassHelper/Int";
import { applyModifiers, StatsModifier } from "../Character/StatsModifier";
import { GameElementDescriptionSection } from "../GameElementDescription/GameElementDescription";

/** A item that can be equiped to a character. */
export abstract class Equipment extends GameItem implements StatsModifier{
  private equipmentStats: CalculatedStats={};
  maxStack = 1;
  readonly abstract type:equipmentname
  /** * The name of the equipment */
  abstract get name():string;
  /** * Check if can be equiped to the character. */
  abstract canEquip(character:Character ):boolean;
  /** * The tags associated with the equipment. */
  abstract get tags():tag[];
  /** * The stats that are going to be applied to the character */
  protected _stats_modifier:CalculatedStats = {};
  protected _resistance_stats:ResistanceStats = {};
  get statsModifier() { return this._stats_modifier; }
  get resistanceStats() { return this._resistance_stats; }
  constructor(masterService:MasterService)
  { super(masterService); }
  /** * The reactions the equipment privides. */
  get reactions(): Reaction[]{return []};
  /** * The special attacks the equipment privides */
  get specials():SpecialAttack[]{return []};

  get isBattleUsable(): boolean{return true;};
  get isPartyUsable(): boolean {return false;};
  get isEnemyUsable(): boolean {return false;};
  get isSelfUsable() : boolean {return true;};
  get isSingleTarget(): boolean {return true;};
  protected _itemEffect(user:Character,target: Character):ActionOutput{
    applyModifiers(user,this);
    return [[],[]];
  }
  get added_description_sections():GameElementDescriptionSection[]{
    const equipmentDescripitonStats:GameElementDescriptionSection={name:'stats',section_items:[]};
    const equipmentDescripitonResistance:GameElementDescriptionSection={name:'resistance',section_items:[]};
    if(Math.max(...Object.values(this.statsModifier)))
    for(const [stat,value] of Object.entries(this.statsModifier)){
      if(value===0)continue;
      //@ts-ignore
      equipmentDescripitonStats.section_items.push({name:aliasStatType[stat],value});
    }
    if(Math.max(...Object.values(this.resistanceStats)))
    for(const [stat,value] of Object.entries(this.resistanceStats)){
      if(value===0)continue;
      //@ts-ignore
      equipmentDescripitonResistance.section_items.push({name:aliasStatType[stat],value});
    }
    return  [
      equipmentDescripitonStats,
      equipmentDescripitonResistance,
    ]
  }
}
const aliasStatType = {
  "physical_attack"  : "atk",
  "ranged_attack"    : "rnge",
  "physical_defence" : "def",
  "ranged_defence"   : "rdef",
  "accuracy"         : "acc",
  "evasion"          : "evs",
  "initiative"       : "init",
  "heatresistance"   : "heat",
  "energyresistance" : "energy",
  "frostresistance"  : "frost",
  "slashresistance"  : "slash",
  "bluntresistance"  : "blunt",
  "pierceresistance" : "pierce",
  "poisonresistance" : "poison",
}
