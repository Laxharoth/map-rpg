import { BeforeActionReaction } from 'src/gameLogic/custom/Class/Character/Reaction/Reaction';
import { tag } from 'src/gameLogic/custom/customTypes/tags';
import { BattleCommand } from '../../Battle/BattleCommand';
import { Character } from '../Character';
import { ActionOutput } from '../Character.type';

export class ReactionGuard extends BeforeActionReaction{
  type: string = "ReactionGuard";
  protected name: string = "ReactionGuard";
  protected whatTriggers: tag[][]=[[]];
  //@ts-ignore
  protected prevent_reaction: tag[][] = [['paralized'],['benefic']]
  protected action(react_character: Character, {source, target}:BattleCommand): ActionOutput {
    if(react_character.allys.includes(source)){ return [[],[]]; }
    for(let i = 0; i < target.length; i++) {
      if(react_character.allys.includes(target[i])) {
        target[i] = react_character
      }
    }
    return [[],[]]
  }

}
