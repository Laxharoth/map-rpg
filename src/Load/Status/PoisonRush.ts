import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { BattleCommand } from "src/gameLogic/custom/Class/Battle/BattleCommand";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput, CalculatedStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Reaction as ReactionClass } from "src/gameLogic/custom/Class/Character/Reaction/Reaction";
import { tag } from "src/gameLogic/custom/customTypes/tags";

// tslint:disable: max-classes-per-file
const register: registerFunction = ({perk,status,reaction},
  {perk:{Perk},reaction:{Reaction},status:{StatusBattle}}, Factory) => {
  class PoisonRushReaction extends Reaction{
    protected name: string = "PoisonRushReaction";
    type: string ="PoisonRushReaction"
    protected whatTriggers: tag[][] = [['status ended' , 'poison']];
    protected action(reactCharacter: Character,{source,target}:BattleCommand): ActionOutput {
      return reactCharacter.addStatus(new PoisonRush(this.masterService))
    }
  }
  class PerkPoisonRush extends Perk {
    readonly poisonRush = new PoisonRushReaction(this.masterService);
    readonly type:"PerkPoisonRush"="PerkPoisonRush"
    get name():string{ return 'Posion Rush';}
    get tags(): tag[] { return [] }

    get reactions(): ReactionClass[] {return [this.poisonRush]}
  }
  class PoisonRush extends StatusBattle{
    private target!:Character;
    readonly type:"PoisonRush"="PoisonRush";
    get name(): string { return "Poison Rush"; }
    get description(): string { return 'increase physicall attack after poison status is lost' }
    protected DURATION: number = 1;
    onStatusGainded(target: Character): ActionOutput{
      this.target = target;
      return Factory
        .pushBattleActionOutput([[],['Overcoming poison grants extra attack']],super.onStatusGainded(target))
    }
    // @ts-ignore
    protected get _stats_modifier():CalculatedStats{
      return { physicalAttack: this.target.calculatedStats.physicalAttack * 3  };
    };
  }
  // tslint:disable: no-string-literal
  perk["PerkPoisonRush"]=PerkPoisonRush
  status["PoisonRush"]=PoisonRush
  reaction["PoisonRushReaction"]=PoisonRushReaction
}
const moduleName = "PoisonRush"
const moduleDependency:string[] = ["Poison"]
export { register, moduleName, moduleDependency}
