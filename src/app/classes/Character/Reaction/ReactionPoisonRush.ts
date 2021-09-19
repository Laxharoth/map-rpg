import { ActionOutput } from "src/app/customTypes/customTypes";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../Character";
import { Reaction } from "./Reaction";

export class PoisonRush extends Reaction
{
  protected whatTriggers: tag[][] = [['status ended' , 'poison']];
  protected action(source: Character, target: Character): ActionOutput {
      target.roundStats.attack*=4;
      return [[],['Overcoming poison grants extra attack']]
  }
}
