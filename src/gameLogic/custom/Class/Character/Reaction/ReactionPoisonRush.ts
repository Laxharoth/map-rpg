import { Reaction } from 'src/gameLogic/custom/Class/Character/Reaction/Reaction';
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { PoisonRush } from '../../Status/StatusTemporal/PoisonRush';
import { Character } from "../Character";
import { ActionOutput } from "../Character.type";

export class PoisonRushReaction extends Reaction
{
  protected whatTriggers: tag[][] = [['status ended' , 'poison']];
  protected action(react_character: Character,source:Character,target: Character[]): ActionOutput {
    return react_character.addStatus(new PoisonRush(this.masterService))
  }
}
