import { ActionOutput, characterStats, damageTypes } from "../customTypes/customTypes";

export function getInputs():{input:string,select:string}
{
  const input:any = document.getElementById('unique-input');
  const inputValue = input?.value||'';
  const select:any = document.getElementById('unique-select')
  const selectValue = select?.value||null;
  return {input:inputValue, select:selectValue};
}

export function pushBattleActionOutput(source:ActionOutput,target:ActionOutput):ActionOutput
{
  target[0].push(...source[0])
  target[1].push(...source[1])
  return target;
}

export function randomBetween(min:number, max:number):number{
  return Math.floor(Math.random()*(max-min+1)+min);
}

export function randomCheck(percent:number):boolean
{
  return percent >= Math.random()*100;
}

export const loadCharacterStats = (function ()
{
  const _defaultStats:characterStats = { hitpoints : 1, energypoints : 0, 
    attack : 0, aim: 0, defence : 0, speed : 0, evasion : 0,
    heatresistance: 0, energyresistance:0, frostresistance:0, slashresistance: 0, bluntresistance:0, pierceresistance: 0, poisonresistance : 0,}
  return function (characterStats:characterStats):characterStats
  {
    const myStats:characterStats = {..._defaultStats}
    for(const key of Object.keys(characterStats))
      myStats[key] = characterStats[key]
    return myStats;
  }
})()

export const loadWeaponDamage = (function() {
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