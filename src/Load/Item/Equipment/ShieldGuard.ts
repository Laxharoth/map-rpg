import { MasterService } from "src/app/service/master.service";
import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { BattleCommand } from "src/gameLogic/custom/Class/Battle/BattleCommand";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Reaction } from "src/gameLogic/custom/Class/Character/Reaction/Reaction";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:registerFunction = ({reaction,gameItem: game_item,status}, {status:{StatusBattle},gameItem:{Shield},reaction:{BeforeActionReaction}}, Factory)=>{
  class ReactionGuard extends BeforeActionReaction
  {
    readonly type:"ReactionGuard"="ReactionGuard"
    protected name: string = "ReactionGuard";
    protected whatTriggers: tag[][]=[[]];
    protected preventReaction: tag[][] = [['paralized']]
    protected action(react_character: Character, {source,target}:BattleCommand): ActionOutput {
      if(this.masterService.partyHandler.isPartyMember(source))return [[],[]]
      for(let i = 0; i < target.length; i++) {
        if(this.masterService.partyHandler.isPartyMember(target[i])) {
          target[i] = react_character
        }
      }
      return [[],[]]
    }
  }
  class ShieldGuard extends Shield
  {
    readonly type:"ShieldGuard"="ShieldGuard";
    get name(): string { return "Guard Shield" }
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
    readonly type:"StatusGuard"="StatusGuard"
    get name(): string { return "StatusGuard" }
    get description(): string {
      return "redirects actions from other party members"
    }
    get reactions(): Reaction[] {
        return [StatusGuard.REACTION_GUARD]
    }
  }
  reaction["ReactionGuard"]=ReactionGuard
  game_item["ShieldGuard"]=ShieldGuard
  status["StatusGuard"]=StatusGuard
}
const module_name="StatusGuard";
const module_dependency:string[] = [];
export { register, module_name, module_dependency}
