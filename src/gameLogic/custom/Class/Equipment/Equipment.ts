import { MasterService } from "src/app/service/master.service";
import { ActionOutput, Character, characterStats, physicStats, resistanceStats } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput, CalculatedStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Reaction } from 'src/gameLogic/custom/Class/Character/Reaction/Reaction';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { equipmentname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { tag } from "src/gameLogic/custom/customTypes/tags";

/**
 * A item that can be equiped to a character.
 *
 * @export
 * @abstract
 * @class Equipment
 * @extends {GameItem}
 */
export abstract class Equipment extends GameItem
{
  private equipmentStats: CalculatedStats={};
  maxStack = 1;
  /** * The name of the equipment */
  abstract get name():equipmentname;
  /** * Check if can be equiped to the character. */
  abstract canEquip(character:Character ):boolean;
  /** * The tags associated with the equipment. */
  abstract get tags():tag[];
  /** * The stats that are going to be applied to the character */
  protected _stats_modifier:CalculatedStats = {};
  protected _resistance_stats:ResistanceStats = {};
  protected get statsModifier() { return this._stats_modifier; }
  protected get resistanceStats() { return this._resistance_stats; }
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
  protected _itemEffect(user:Character,target: Character):ActionOutput
  {
    this.applyModifiers(user);
    return [[],[]];
  }
  /**
   * Applies stat modifiers to the equiped character.
   *
   * @param {Character} character
   * @memberof Equipment
   */
  applyModifiers(character:Character):void
  {
    for(const key of Object.keys(this.statsModifier))
    { character.calculated_stats[key] += this.statsModifier[key]}
    for(const key of Object.keys(this.resistanceStats))
    { character.calculated_resistance[key] += this.resistanceStats[key]}
  }
  /**
   * Removes stat modifiers to the equiped character.
   *
   * @param {Character} character
   * @memberof Equipment
   */
  removeModifier(character:Character):void
  {
    for(const key of Object.keys(this.statsModifier))
    { character.calculated_stats[key] -= this.statsModifier[key]}
    for(const key of Object.keys(this.resistanceStats))
    { character.calculated_resistance[key] -= this.resistanceStats[key]}
  }

  get description():string
  {
    let equipmentDescripitonStats='';
    let equipmentDescripitonResistance='';
    if(Math.max(...Object.values(this.statsModifier)))
    {
      equipmentDescripitonStats = 'stats:';
      let even = true;
      for(const [stat,value] of Object.entries(this.statsModifier))
      {
        if(value===0)continue;
        if(even) equipmentDescripitonStats+='\n';
        even=!even;
        equipmentDescripitonStats+=`\t${stat}:${value}`;
      }
    }
    if(Math.max(...Object.values(this.resistanceStats)))
    {
      equipmentDescripitonResistance = 'resistance:';
      let even = true;
      for(const [stat,value] of Object.entries(this.resistanceStats))
      {
        if(value===0)continue;
        if(even) equipmentDescripitonResistance+='\n';
        even=!even;
        equipmentDescripitonResistance+=`\t${Equipment.aliasStatType(stat)}:${value}`;
      }
    }
    return  equipmentDescripitonStats+`${equipmentDescripitonStats.length?'\n':''}`+
            `${equipmentDescripitonResistance}`+`${equipmentDescripitonResistance.length?'\n':''}`+
            `${super.description}`
  }

  private static aliasStatType(type: string):string
  {
    switch (type)
    {
      case "physical_attack"  :return "atk";
      case "ranged_attack"    :return "rnge";
      case "physical_defence" :return "def";
      case "ranged_defence"   :return "rdef";
      case "accuracy"         :return "acc";
      case "evasion"          :return "evs";
      case "heatresistance"   :return "heat";
      case "energyresistance" :return "energy";
      case "frostresistance"  :return "frost";
      case "slashresistance"  :return "slash";
      case "bluntresistance"  :return "blunt";
      case "pierceresistance" :return "pierce";
      case "poisonresistance" :return "poison";
      default:return "";
    }
  }

}
