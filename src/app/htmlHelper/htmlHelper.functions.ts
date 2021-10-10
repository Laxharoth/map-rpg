import { coreStats, physicStats, resistanceStats } from './../customTypes/customTypes';
import { ActionOutput, characterStats, damageTypes } from "../customTypes/customTypes";

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

export function removeItem<T>(array:T[],item:T):void { array.splice(array.indexOf(item),1); }

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
  return Math.floor(Math.random()*(max-min+1)+min);
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
  return percent >= Math.random()*100;
}

/**
 *  Fills missing CharacterStats
 *
 * @param {*} {characterStats} characterStats The original character stats (can have attributes missing)
 * @return {*} {characterStats} The stats with all the possible attributes.
 */
export const loadCharacterStats = (function ()
{
  const _defaultStats:characterStats = { hitpoints : 1, energypoints : 0,
    attack : 0, aim: 0, defence : 0, speed : 0, evasion : 0,
    heatresistance: 0, energyresistance:0, frostresistance:0, slashresistance: 0, bluntresistance:0, pierceresistance: 0, poisonresistance : 0,}
  return function (characterStats:characterStats):{core:coreStats,physic:physicStats,resistance:resistanceStats}
  {
    const myStats:characterStats = {..._defaultStats}
    for(const key of Object.keys(characterStats))
      myStats[key] = characterStats[key]
    return {
      core:{hitpoints:myStats['hitpoints'],energypoints:myStats['energypoints']},
      physic:{attack : myStats['attack'], aim: myStats['aim'], defence : myStats['defence'], speed : myStats['speed'], evasion : myStats['evasion']},
      resistance:{heatresistance: myStats['heatresistance'], energyresistance:myStats['energyresistance'], frostresistance:myStats['frostresistance'], slashresistance: myStats['slashresistance'], bluntresistance:myStats['bluntresistance'], pierceresistance: myStats['pierceresistance'], poisonresistance : myStats['poisonresistance']}
    };
  }
})()

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
