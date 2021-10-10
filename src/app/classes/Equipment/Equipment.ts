import { loadCharacterStats } from 'src/app/htmlHelper/htmlHelper.functions';
import { ActionOutput, characterStats, physicStats, resistanceStats, storeable } from "src/app/customTypes/customTypes";
import { equipmentname } from "src/app/customTypes/itemnames";
import { tag } from "src/app/customTypes/tags";
import { MasterService } from "src/app/service/master.service";
import { Character } from "../Character/Character";
import { Reaction } from "../Character/Reaction/Reaction";
import { Item } from "../Items/Item";
import { SpecialAttack } from "../Items/SpecialAttack/SpecialAttack";

/**
 * A item that can be equiped to a character.
 *
 * @export
 * @abstract
 * @class Equipment
 * @extends {Item}
 */
export abstract class Equipment extends Item
{
  maxStack = 1;
  /**
   * The name of the equipment
   *
   * @readonly
   * @abstract
   * @type {equipmentname}
   * @memberof Equipment
   */
  abstract get name():equipmentname;
  /**
   * Check if can be equiped to the character.
   *
   * @abstract
   * @param {Character} character The character to be equiped to.
   * @return {*}  {boolean}
   * @memberof Equipment
   */
  abstract canEquip(character:Character ):boolean;
  /**
   * The tags associated with the equipment.
   *
   * @readonly
   * @abstract
   * @type {tag[]}
   * @memberof Equipment
   */
  abstract get tags():tag[];
  /**
   * The stats that are going to be applied to the character-
   *
   * @protected
   * @abstract
   * @type {characterStats}
   * @memberof Equipment
   */
  protected equipmentStats: characterStats = {};
  protected statsModifier:physicStats;
  protected resistanceStats:resistanceStats;
  constructor(masterService:MasterService,equipmentStats:characterStats={})
  {
    super(masterService);
    this.equipmentStats = equipmentStats;
    ({physic:this.statsModifier,resistance:this.resistanceStats} = loadCharacterStats(this.equipmentStats))
  }
  /**
   * The reactions the equipment privides.
   *
   * @readonly
   * @type {Reaction[]}
   * @memberof Equipment
   */
  get reactions(): Reaction[]{return []};
  /**
   * The special attacks the equipment privides
   *
   * @readonly
   * @type {SpecialAttack[]}
   * @memberof Equipment
   */
  get specials():SpecialAttack[]{return []};

  get isBattleUsable(): boolean{return true;};
  get isPartyUsable(): boolean {return false;};
  get isEnemyUsable(): boolean {return false;};
  get isSelfUsable() : boolean {return true;};
  get isSingleTarget(): boolean {return true;};
  itemEffect(user:Character,target: Character):ActionOutput
  {
    this.applyModifiers(user);
    return super.itemEffect(user, user);
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
    { character.stats[key] += this.statsModifier[key]}
    for(const key of Object.keys(this.resistanceStats))
    { character.resistance[key] += this.resistanceStats[key]}
  }
  removeModifier(character:Character):void
  {
    for(const key of Object.keys(this.statsModifier))
    { character.stats[key] -= this.statsModifier[key]}
    for(const key of Object.keys(this.resistanceStats))
    { character.resistance[key] -= this.resistanceStats[key]}
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
      case "hitpoints"    :return "hp";
      case "energypoints" :return "sp";
      case "attack"       :return "atk";
      case "aim"          :return "aim";
      case "defence"      :return "def";
      case "speed"        :return "spd";
      case "evasion"      :return "evs";
      case "heatresistance"   :return "heat";
      case "energyresistance" :return "energy";
      case "frostresistance"  :return "frost";
      case "slashresistance"  :return "slash";
      case "bluntresistance"  :return "blunt";
      case "pierceresistance" :return "pierce";
      case "poisonresistance" :return "poison";
    }
    return "";
  }
}
