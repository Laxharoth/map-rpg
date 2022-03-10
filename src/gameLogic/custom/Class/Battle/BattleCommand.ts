import { tag } from 'src/gameLogic/custom/customTypes/tags';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from 'src/gameLogic/custom/Class/Character/Character.type';

export interface BattleCommand
{
  source:Character;
  target:Character[];
  tags:tag[];
  priority?:number;
  excecute:() => ActionOutput;
}
export class EmptyCommand implements BattleCommand
{
  source:Character;
  target:Character[];
  tags:tag[]=[];
  excecute:() => ActionOutput;
  constructor(source:Character, target: Character[]) {
    this.source= source;
    this.target= target;
    this.excecute = ()=>[[],[]];
  }
}
export class DefeatedCommand implements BattleCommand
{
  source:Character;
  target:Character[];
  tags:tag[]=[];
  excecute:() => ActionOutput;
  constructor(source:Character, target: Character[]) {
    this.source= source;
    this.target= target;
    this.excecute = ()=>this.source.onDefeated();
  }
}
export const ITEM_PRIORITY = 5;
export const DEFEND_PRIORITY = 5;
