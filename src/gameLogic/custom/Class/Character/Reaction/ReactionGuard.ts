import { BeforeActionReaction } from 'src/gameLogic/custom/Class/Character/Reaction/Reaction';
import { tag } from 'src/gameLogic/custom/customTypes/tags';
import { Character } from '../Character';
import { ActionOutput } from '../Character.type';

export class ReactionGuard extends BeforeActionReaction
{
  protected whatTriggers: tag[][]=[[]];
  //@ts-ignore
  protected prevent_reaction: tag[][] = [['paralized'],['benefic']]
  protected action(react_character: Character, source: Character, target: Character[]): ActionOutput {
    if(this.masterService.partyHandler.is_party_member(source))return [[],[]]
    for(let i = 0; i < target.length; i++) {
      if(this.masterService.partyHandler.is_party_member(target[i])) {
        target[i] = react_character
      }
    }
    return [[],[]]
  }

}
