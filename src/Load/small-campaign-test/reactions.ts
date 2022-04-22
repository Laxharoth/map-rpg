import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { BattleCommand } from "src/gameLogic/custom/Class/Battle/BattleCommand";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Reaction as ReactionClass } from "src/gameLogic/custom/Class/Character/Reaction/Reaction";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { StatusFactoryFuctioin } from "src/gameLogic/custom/Factory/StatusFactory";

const register:registerFunction = ({reaction,perk}, {reaction:{BeforeActionReaction,Reaction},perk:{Perk}}, Factory)=>{
  const statusFactory = Factory as StatusFactoryFuctioin;
  class PackTactics extends BeforeActionReaction{
    protected whatTriggers: tag[][] = [];
    protected name: string = "Pack Tactics";
    type="PackTactics";
    protected action(reactCharacter: Character, action:BattleCommand): ActionOutput {
      if(
        this.masterService.partyHandler
          .enemyFormation.enemies
          .find( enemy => enemy!==reactCharacter && enemy.type === "Bandit" && !enemy.isDefeated())
      ){
        reactCharacter.addStatus(statusFactory(this.masterService,{ Factory:"Status", type:"Advantage"}));
      }
      return [[],[]];
    }
  }
  // tslint:disable: max-classes-per-file
  class BlindInmune extends BeforeActionReaction{
    protected whatTriggers: tag[][] = [["fake egg","Blind","status gained"]];
    protected name: string = "Blind Inmune";
    type="BlindInmune";
    protected action(reactCharacter: Character, { target }: BattleCommand): ActionOutput {
      target.splice( target.indexOf(reactCharacter), 1 );
      return [[],[`${reactCharacter.name} is inmune to blind`]]
    }

  }
  class BlindInmunePerk extends Perk{
    readonly blindInmune = new BlindInmune(this.masterService);
    get name(): string {
      return "Blind Inmune Perk";
    }
    type:perkname="BlindInmune";
    get reactions(): ReactionClass[] {
      return [this.blindInmune];
    }
  }
  class PackTacticsPerk extends Perk{
    readonly packTactics = new PackTactics(this.masterService);
    get name(): string {
      return "Blind Inmune Perk";
    }
    type:perkname="PackTactics";
    get reactions(): ReactionClass[] {
      return [this.packTactics];
    }
  }
  // tslint:disable: no-string-literal
  reaction["PackTactics"] = PackTactics;
  reaction["BlindInmune"] = BlindInmune;
  perk["BlindInmune"] = BlindInmunePerk;
  perk["PackTactics"] = PackTacticsPerk;
}
const moduleName = "small-campaign-reaction";
const moduleDependency:string[] = ["small-campaign-status"];
export { register, moduleName, moduleDependency };
