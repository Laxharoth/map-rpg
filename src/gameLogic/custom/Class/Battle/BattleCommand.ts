import { tag } from 'src/gameLogic/custom/customTypes/tags';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from 'src/gameLogic/custom/Class/Character/Character.type';

export class BattleCommand
{
  source:Character;
  target:Character[];
  tags:tag[];
  private action:(target:Character[]) => ActionOutput;
  constructor(source:Character, target:Character[],tags:tag[], action:(target:Character[]) => ActionOutput)
  {
    this.source = source;
    this.target = target;
    this.tags=tags;
    this.action = action;
  }
  excecute():ActionOutput {
    return this.action(this.target);
  }
}
export class EmptyCommand extends BattleCommand
{
  constructor(source:Character, target: Character[]) { super(source, target,[],(target:Character[])=>[[],[]]); }
}
export class DefeatedCommand extends BattleCommand
{
  constructor(source:Character, target: Character[]) { super(source, target,[],(target:Character[])=>this.source.onDefeated()); }
}
