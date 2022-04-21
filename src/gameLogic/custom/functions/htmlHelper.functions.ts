import { Chance } from 'chance';
import { DamageTypes, FullDamageTypes } from 'src/gameLogic/custom/Class/Battle/DamageSource';
import { ActionOutput } from 'src/gameLogic/custom/Class/Character/Character.type';

const rng = new Chance()
/** In scenes that use input elements get the value of the input and select. */
export function getInputs():{input:string,select:string}{
  const input:any = document.getElementById('unique-input');
  const inputValue = input?.value||'';
  const select:any = document.getElementById('unique-select')
  const selectValue = select?.value||null;
  return {input:inputValue, select:selectValue};
}
/** Removes an element from the an array if the element is in the array. */
export function removeItem<T>(array:T[],item:T):boolean{
  const element = array.splice(array.indexOf(item),1);
  return Boolean(element.length);
}

/**
 * Pushes the scenes in the fisrt array to the scenes of the second
 * Pushes the strings in the first array to the strings of the second array
 */
export function pushBattleActionOutput(source:ActionOutput,target:ActionOutput):ActionOutput
{
  target[0].push(...source[0])
  target[1].push(...source[1])
  return target;
}

/** Returns a integer between the values provided */
export function randomBetween(min:number, max:number):number{
  if(min > max) [min,max] = [max,min];
  return rng.integer({ min,max });
}

/** Generates a random number between 0 and 100, and checks if the number provided is bigger. */
export function randomCheck(percent:number):boolean{
  return rng.bool({likelihood:percent })
}

export function MakeFilledArray<T>(array_size: number,default_value: T): T[] {
  return Array.from(Array(array_size).map(_=>default_value))
}

export function floorTo(nuber_to_round:number,coefficient:number):number{
  return Math.floor(nuber_to_round/coefficient)*coefficient;
}

export const setTheme = (()=>{
  enum themeNamesEnum {
    default="default"
  }
  type themeName = `${themeNamesEnum}`
  const themes:{[key in themeNamesEnum]:string} = {
    default:"./assets/theme/default.css"
  }
  return (theme_name:themeName|null=null)=>{
    if(!theme_name)theme_name=localStorage.getItem('theme') as themeName;
    if(!theme_name)theme_name='default';
    //@ts-ignore
    document.getElementById("theme")?.href=themes[theme_name];
    localStorage.setItem('theme',theme_name);
  }
})();

export function compareArray<T>(array1:T[],array2:T[]): boolean{
  if(array1.length != array2.length)return false;
  for(let i = 0; i < array1.length; i++)
    if(array1[i] !== array2[i])return false;
  return true;
}
export function setUnion<T>(set: Set<T>, iterable: Iterable<T>):Set<T>{
  const union_set = new Set<T>(set);
  for(const item of iterable)union_set.add(item);
  return union_set
}
export function setIntersection<T>(set: Set<T>, iterable: Iterable<T>):Set<T>{
  const intersection_set = new Set<T>();
  for(const item of iterable) if(set.has(item))intersection_set.add(item);
  return intersection_set
}
export function setComplement<T>(target: Set<T>, all_elements: Iterable<T>){
  const complement_set = new Set<T>();
  for(const item of all_elements) if(!target.has(item))complement_set.add(item)
  return complement_set
}
export function setEquality<T>(set1: Set<T>, set2: Set<T>):boolean {
  if(set1.size !== set2.size)return false;
  for(const item of set2)if(!set1.has(item))return false;
  return true;
}
