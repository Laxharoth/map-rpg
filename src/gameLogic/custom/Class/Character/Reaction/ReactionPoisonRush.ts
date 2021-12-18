import { Reaction } from 'src/gameLogic/custom/Class/Character/Reaction/Reaction';
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { Character } from "../Character";
import { ActionOutput } from "../Character.type";

export class PoisonRush extends Reaction
{
  protected whatTriggers: tag[][] = [['status ended' , 'poison']];
  protected action(source: Character, target: Character): ActionOutput {
      target.calculated_stats.physical_attack*=4;
      return [[],['Overcoming poison grants extra attack']]
  }
}
