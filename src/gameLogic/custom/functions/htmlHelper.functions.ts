import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { damageTypes } from 'src/gameLogic/custom/Class/Equipment/Weapon/Weapon';
import random from "random"

/**
 * In descriptions that use input elements get the value of the input and select.
 *
 * @export
 * @return {*}  {{input:string,select:string}}
 */
export function getInputs():{input:string,select:string}
{
  const input:any = document.getElementById('unique-input');
  const inputValue = input?.value||'';
  const select:any = document.getElementById('unique-select')
  const selectValue = select?.value||null;
  return {input:inputValue, select:selectValue};
}
/**
 * Removes an element from the an array if the element is in the array.
 *
 * @export
 * @template T
 * @param {T[]} array The Array.
 * @param {T} item The element to remove.
 * @return {*}  {boolean} If the element was removed.
 */
export function removeItem<T>(array:T[],item:T):boolean
{
  const element = array.splice(array.indexOf(item),1);
  return Boolean(element.length);
}

/**
 * Pushes the descriptions in the fisrt array to the descriptions of the second
 * Pushes the strings in the first array to the strings of the second array
 * @export
 * @param {ActionOutput} source The descriptions and strings to be pushed.
 * @param {ActionOutput} target The original array of descriptions and strings.
 * @return {*}  {ActionOutput}
 */
export function pushBattleActionOutput(source:ActionOutput,target:ActionOutput):ActionOutput
{
  target[0].push(...source[0])
  target[1].push(...source[1])
  return target;
}

/**
 * Returns a integer between the values provided
 *
 * @export
 * @param {number} min The minimum value that can be returned
 * @param {number} max The maximum value that can be returned
 * @return {*}  {number}
 */
export function randomBetween(min:number, max:number):number{
  return random.integer(min, max);
}

/**
 * Generates a random number between 0 and 100, and checks if the number provided is bigger.
 *
 * @export
 * @param {number} percent The probability the function should return true.
 * @return {*}  {boolean}
 */
export function randomCheck(percent:number):boolean
{
  return percent >= random.float(0,100);
}

/**
 *  Fills missing weapon damageTypes
 *
 * @param {*} {damageTypes} weaponDamages The original weapon damage stats (can have attributes missing)
 * @return {*} {damageTypes} The stats with all the possible attributes.
 */
export const fillMissingWeaponDamage = (function() {
  const _defaultStats:damageTypes = {
     heatdamage  :0,
     energydamage:0,
     frostdamage :0,
     slashdamage :0,
     bluntdamage :0,
     piercedamage:0,
     poisondamage:0,
  }
  return function(weaponDamages:damageTypes):damageTypes
  {
    const myStats = {..._defaultStats}
    for(const key of Object.keys(weaponDamages))
      myStats[key] = weaponDamages[key]
    return weaponDamages;
  }
})()

export function MakeFilledArray<T>(array_size: number,default_value: T): T[] {
  return Array.from(Array(array_size).map(_=>default_value))
}

export function floor_to(nuber_to_round:number,coefficient:number):number
{
  return Math.floor(nuber_to_round/coefficient)*coefficient;
}
