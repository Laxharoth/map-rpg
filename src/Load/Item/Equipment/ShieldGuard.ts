import { MasterService } from "src/app/service/master.service";
import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Reaction } from "src/gameLogic/custom/Class/Character/Reaction/Reaction";
import { shieldname } from "src/gameLogic/custom/Class/Items/Item.type";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:register_function = ({reaction,game_item,status}, {status:{StatusBattle},game_item:{Shield},reaction:{BeforeActionReaction}}, Factory)=>{
  class ReactionGuard extends BeforeActionReaction
  {
    protected name: string = "ReactionGuard";
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
  class ShieldGuard extends Shield
  {
    get name(): shieldname {
      return "Guard Shield"
    }
    canEquip(character: Character): boolean {
      return true
    }
    defend(targets: Character[]): ActionOutput {
        const output = super.defend(targets);
        for(const target of targets) {
          Factory.pushBattleActionOutput(target.addStatus(new StatusGuard(this.masterService)),output)
        }
        return output;
    }
  }
  class StatusGuard extends StatusBattle
  {
    private static REACTION_GUARD:ReactionGuard;
    protected DURATION: number=1;
    constructor(masterService:MasterService)
    {
      super(masterService)
      if(!StatusGuard.REACTION_GUARD)StatusGuard.REACTION_GUARD=new ReactionGuard(masterService);
    }
    get name(): statusname {
      return "StatusGuard"
    }
    get description(): string {
      return "redirects actions from other party members"
    }
    get reactions(): Reaction[] {
        return [StatusGuard.REACTION_GUARD]
    }
  }
  reaction["ReactionGuard"]=ReactionGuard
  game_item["Guard Shield"]=ShieldGuard
  status["StatusGuard"]=StatusGuard
}
const module_name="StatusGuard";
const module_dependency = [];
export { register, module_name, module_dependency}
