import { calculateDamage, DamageSource, damageTypes } from 'src/gameLogic/custom/Class/Battle/DamageSource';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Equipment } from "src/gameLogic/custom/Class/Equipment/Equipment";
import { GameElementDescriptionSection } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';
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
export abstract class Weapon extends Equipment implements DamageSource
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
  get damageTypes():damageTypes {
    if(!this.filledDamageTypes)
    {
      this.filledDamageTypes = true;
      this._damageTypes = fillMissingWeaponDamage(this.damageTypes);
    }
    return this._damageTypes;
  }
  readonly abstract type: weaponname;
  abstract get name():string;
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
  abstract damagestat(user   : Character):number;
  /**
   * Gets the stat from the character that will be used to calculate the reduction of damage.
   *
   * @protected
   * @abstract
   * @param {Character} target The character target of the attack.
   * @return {*}  {number}
   * @memberof Weapon
   */
  abstract defencestat(target: Character):number;
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
  { return calculateDamage(this,user,target); }
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

  get added_description_sections():GameElementDescriptionSection[]
  {
    const damage_stats_description:GameElementDescriptionSection={name:'damage',section_items:[]};
    if(Math.max(...Object.values(this.damageTypes)))
    for(const [stat,value] of Object.entries(this.damageTypes))
    {
      if(value===0)continue;
      damage_stats_description.section_items.push({name:aliasDamageType[stat],value});
    }
    return  [
      damage_stats_description,
      ...super.added_description_sections
    ]
  }

}
const aliasDamageType={
  "heatdamage"   : "heat  ",
  "energydamage" : "energy",
  "frostdamage"  : "frost ",
  "slashdamage"  : "slash ",
  "bluntdamage"  : "blunt ",
  "piercedamage" : "pierce",
  "poisondamage" : "poison",
}
