import { ActionOutput, Character } from 'src/gameLogic/custom/Class/Character/Character';
import { Equipment } from "src/gameLogic/custom/Class/Equipment/Equipment";
import { weaponname } from 'src/gameLogic/custom/Class/Items/Item.type';
import { fillMissingWeaponDamage, pushBattleActionOutput, randomBetween } from 'src/gameLogic/custom/functions/htmlHelper.functions';

/**
 * Type of equipment that can attack.
 *
 * @export
 * @abstract
 * @class Weapon
 * @extends {Equipment}
 */
export abstract class Weapon extends Equipment
{
  /**
   * The damage types associated with this weapon.
   *
   * @protected
   * @type {damageTypes}
   * @memberof Weapon
   */
  protected _damageTypes:damageTypes = {};
  private filledDamageTypes:boolean = false;
  protected get damageTypes():damageTypes {
    if(!this.filledDamageTypes)
    {
      this.filledDamageTypes = true;
      this._damageTypes = fillMissingWeaponDamage(this.damageTypes);
    }
    return this._damageTypes;
  }
  /**
   * The probability that the weapon will hit the target.
   *
   * @protected
   * @abstract
   * @type {number}
   * @memberof Weapon
   */
  /**
   * Can only be a weaponname
   *
   * @readonly
   * @abstract
   * @type {weaponname}
   * @memberof Weapon
   */
  abstract get name():weaponname;
  /**
   * Applies damage to a target.
   *
   * @param {Character} user The character that uses the weapon.
   * @param {Character} target The target that will be attacked.
   * @return {*}  {ActionOutput}
   * @memberof Weapon
   */
  attack(user:Character,target:Character):ActionOutput
  {
    if(this.accuracyTest(user,target) < 0 )
    {return [[],[`${user.name} attack ${target.name} but missed`]];}
    const [descriptions,strings]:ActionOutput = [[],[]];
    const damage = this.calculateDamage(user, target);
    target.takeDamage(damage);
    strings.push(`${target.name} takes ${damage} damage from ${user.name}'s ${this.name}`)
    pushBattleActionOutput(target.react(this.tags,user),[descriptions,strings]);
    return [descriptions,strings];
  }
  /**
   * Gets the stat from the character that will be used to calculate the damage.
   *
   * @protected
   * @abstract
   * @param {Character} user The character with the equiped weapon.
   * @return {*}  {number}
   * @memberof Weapon
   */
  protected abstract damagestat(user   : Character):number;
  /**
   * Gets the stat from the character that will be used to calculate the reduction of damage.
   *
   * @protected
   * @abstract
   * @param {Character} target The character target of the attack.
   * @return {*}  {number}
   * @memberof Weapon
   */
  protected abstract defencestat(target: Character):number;
  /**
   * Calculated the damage based on the weapon damage types.
   *
   * @protected
   * @param {Character} user The character that performed the attack.
   * @param {Character} target The character that received the attack.
   * @return {*}  {number}
   * @memberof Weapon
   */
  protected calculateDamage(user:Character,target:Character):number
  {
    let finalDamage:number = 0;
    const damageRelation = this.damagestat(user) / this.defencestat(target);
    finalDamage += (damageRelation * this.damageTypes.slashdamage||0  / (100 - target.calculated_resistance.slashresistance));
    finalDamage += (damageRelation * this.damageTypes.bluntdamage||0  / (100 - target.calculated_resistance.bluntresistance));
    finalDamage += (damageRelation * this.damageTypes.piercedamage||0 / (100 - target.calculated_resistance.pierceresistance));
    finalDamage += (damageRelation * this.damageTypes.poisondamage||0 / (100 - target.calculated_resistance.poisonresistance));
    finalDamage += (damageRelation * this.damageTypes.heatdamage||0   / (100 - target.calculated_resistance.heatresistance));
    finalDamage += (damageRelation * this.damageTypes.energydamage||0 / (100 - target.calculated_resistance.energyresistance));
    finalDamage += (damageRelation * this.damageTypes.frostdamage||0  / (100 - target.calculated_resistance.frostresistance));
    return Math.round(finalDamage)||0;
  }
  /**
   * Check if the attack is successful.
   *
   * @protected
   * @param {Character} user The character that performed the attack.
   * @param {Character} target The character that received the attack.
   * @return {*}  {number}
   * @memberof Weapon
   */
  protected accuracyTest(user:Character,target:Character): number {
    let [minaccuracy,maxaccuracy] = [0,100];
    if(user.hasTag('blind')) maxaccuracy -= 20;
    if(user.hasTag('aim')) maxaccuracy += 20;
    const check = randomBetween(minaccuracy,maxaccuracy+user.calculated_stats.accuracy);
    return check
  }

  get description():string
  {
    let equipmentDescripiton = '';
    if(Math.max(...Object.values(this.damageTypes)))
    {
      equipmentDescripiton = 'Damage:';
      let even = true;
      for(const [stat,value] of Object.entries(this.damageTypes))
      {
        if(value===0)continue;
        if(even) equipmentDescripiton+='\n';
        even=!even;
        equipmentDescripiton+=`\t${Weapon.aliasDamageType(stat)}:${value}`;
      }
    }
    return  equipmentDescripiton+
            `\n${super.description}`
  }

  private static aliasDamageType(type: string):string
  {
    switch (type)
    {
      case "heatdamage"   :return "heat  ";
      case "energydamage" :return "energy";
      case "frostdamage"  :return "frost ";
      case "slashdamage"  :return "slash ";
      case "bluntdamage"  :return "blunt ";
      case "piercedamage" :return "pierce";
      case "poisondamage" :return "poison";
    }
    return "";
  }
}
export interface damageTypes {heatdamage?: number; energydamage?:number; frostdamage?:number; slashdamage?: number; bluntdamage?:number; piercedamage?: number; poisondamage? : number;}
