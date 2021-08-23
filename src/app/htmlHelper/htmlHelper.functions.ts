import { MasterService } from "../classes/masterService";
import { battleActionOutput } from "../customTypes/customTypes";

export function getInputs():{input:string,select:string}
{
  const input:any = document.getElementById('unique-input');
  const inputValue = input?.value||'';
  const select:any = document.getElementById('unique-select')
  const selectValue = select?.value||null;
  return {input:inputValue, select:selectValue};
}

export function pushBattleActionOutput(source:battleActionOutput,target:battleActionOutput):void
{
  target[0].push(...source[0])
  target[1].push(...source[1])
}

export function randomBetween(min:number, max:number):number{
  return Math.floor(Math.random()*(max-min+1)+min);
}

export function randomCheck(percent:number):boolean
{
  return percent < Math.random()*100;
}