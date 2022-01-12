import { ActionOutput } from 'src/gameLogic/custom/Class/Character/Character.type';
import { damageTypes } from 'src/gameLogic/custom/Class/Equipment/Weapon/Weapon';
import random from 'random'
import * as jQuery from 'jquery'

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

export const set_theme = (()=>{
  enum theme_names_enum {
    default="default"
  }
  type theme_name = `${theme_names_enum}`
  const themes:{[key in theme_names_enum]:string} = {
    default:"./assets/theme/default.css"
  }
  return (theme_name:theme_name=null)=>{
    if(!theme_name)theme_name=localStorage.getItem('theme') as theme_name;
    if(!theme_name)theme_name='default';
    jQuery("#theme").attr("href",theme_name)
    localStorage.setItem('theme',themes[theme_name]);
  }
})();

export function compare_array<T>(array1:T[],array2:T[]): boolean
{
  if(array1.length != array2.length)return false;
  for(let i = 0; i < array1.length; i++)
    if(array1[i] !== array2[i])return false;
  return true;
}

export function set_union<T>(set: Set<T>, iterable: Iterable<T>):Set<T>
{
  const union_set = new Set<T>(set);
  for(const item of iterable)union_set.add(item);
  return union_set
}

export function set_intersection<T>(set: Set<T>, iterable: Iterable<T>):Set<T>
{
  const intersection_set = new Set<T>();
  for(const item of iterable) if(set.has(item))intersection_set.add(item);
  return intersection_set
}

export function set_complement<T>(target: Set<T>, all_elements: Iterable<T>)
{
  const complement_set = new Set<T>();
  for(const item of all_elements) if(!target.has(item))complement_set.add(item)
  return complement_set
}

export function set_equality<T>(set1: Set<T>, set2: Set<T>):boolean {
  if(set1.size !== set2.size)return false;
  for(const item of set2)if(!set1.has(item))return false;
  return true;
}
