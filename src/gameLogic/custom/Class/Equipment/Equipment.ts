import { MasterService } from "src/app/service/master.service";
import { ActionOutput, Character, characterStats, physicStats, resistanceStats } from 'src/gameLogic/custom/Class/Character/Character';
import { Reaction } from 'src/gameLogic/custom/Class/Character/Reaction/Reaction';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { equipmentname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { loadCharacterStats } from 'src/gameLogic/custom/functions/htmlHelper.functions';

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
  /** * The stats that are going to be applied to the character */
  protected equipmentStats: characterStats = {};
  protected _statsModifier:physicStats = null;
  protected _resistanceStats:resistanceStats = null;
  protected get statsModifier()
  {
    //Initialize stats the first time is required.
    if(!this._statsModifier)this.setEquipmentStats()
    return this._statsModifier;
  }
  protected get resistanceStats()
  {
    //Initialize stats the first time is required.
    if(!this._resistanceStats)this.setEquipmentStats()
    return this._resistanceStats;
  }
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
  /**
   * Removes stat modifiers to the equiped character.
   *
   * @param {Character} character
   * @memberof Equipment
   */
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
  /**
   * Divides the equipmentStats into _statsModifier and _resistanceStats
   *
   * @private
   * @memberof Equipment
   */
  private setEquipmentStats():void
  { ({physic:this._statsModifier,resistance:this._resistanceStats} = loadCharacterStats(this.equipmentStats)) }

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
