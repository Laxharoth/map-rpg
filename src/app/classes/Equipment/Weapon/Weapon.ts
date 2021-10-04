import { characterStats } from 'src/app/customTypes/customTypes';
import { ActionOutput, damageTypes } from './../../../customTypes/customTypes';
import { Character } from "../../Character/Character";
import { Equipment } from "../Equipment";
import { fillMissingWeaponDamage, pushBattleActionOutput, randomBetween } from 'src/app/htmlHelper/htmlHelper.functions';
import { MasterService } from "src/app/service/master.service";
import { weaponname } from 'src/app/customTypes/itemnames';

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
  protected damageTypes:damageTypes = {};
  protected statsModifier:characterStats = {};
  /**
   * The probability that the weapon will hit the target.
   *
   * @protected
   * @abstract
   * @type {number}
   * @memberof Weapon
   */
  protected abstract accuracy:number;
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
   * Creates an instance of Weapon.
   * Fills the missing weapon damage properties.
   * @param {MasterService} masterService
   * @memberof Weapon
   */
  constructor(masterService:MasterService)
  {
    super(masterService)
    this.damageTypes = fillMissingWeaponDamage(this.damageTypes)
  }
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
    finalDamage += (damageRelation * this.damageTypes.slashdamage||0  / (100 - target.roundStats.slashresistance));
    finalDamage += (damageRelation * this.damageTypes.bluntdamage||0  / (100 - target.roundStats.bluntresistance));
    finalDamage += (damageRelation * this.damageTypes.piercedamage||0 / (100 - target.roundStats.pierceresistance));
    finalDamage += (damageRelation * this.damageTypes.poisondamage||0 / (100 - target.roundStats.poisonresistance));
    finalDamage += (damageRelation * this.damageTypes.heatdamage||0   / (100 - target.roundStats.heatresistance));
    finalDamage += (damageRelation * this.damageTypes.energydamage||0 / (100 - target.roundStats.energyresistance));
    finalDamage += (damageRelation * this.damageTypes.frostdamage||0  / (100 - target.roundStats.frostresistance));
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
    const check = randomBetween(minaccuracy,maxaccuracy+this.accuracy);
    return check - target.roundStats.evasion;
  }
}
