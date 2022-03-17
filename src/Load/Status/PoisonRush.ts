import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { BattleCommand } from "src/gameLogic/custom/Class/Battle/BattleCommand";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Reaction } from "src/gameLogic/custom/Class/Character/Reaction/Reaction";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register: register_function = ({perk,status,reaction}, {perk:{Perk},reaction:{Reaction},status:{StatusBattle}}, Factory) => {
  class PoisonRushReaction extends Reaction
  {
    protected name: string = "PoisonRushReaction";
    type: string ="PoisonRushReaction"
    protected whatTriggers: tag[][] = [['status ended' , 'poison']];
    protected action(react_character: Character,{source,target}:BattleCommand): ActionOutput {
      return react_character.addStatus(new PoisonRush(this.masterService))
    }
  }
  class PerkPoisonRush extends Perk {
    readonly poisonRush = new PoisonRushReaction(this.masterService);
    readonly type:"PerkPoisonRush"="PerkPoisonRush"
    get name():string{ return 'Posion Rush';}
    get tags(): tag[] { return [] }

    get reactions(): Reaction[] {return [this.poisonRush]}
  }
  class PoisonRush extends StatusBattle
  {
    readonly type:"PoisonRush"="PoisonRush";
    get name(): string { return "Poison Rush"; }
    get description(): string { return 'increase physicall attack after poison status is lost' }
    protected DURATION: number = 1;
    applyModifiers(character: Character): void {
      character.calculated_stats.physical_attack*=4;
    }
    onStatusGainded(target: Character): ActionOutput
    {
      return Factory.pushBattleActionOutput([[],['Overcoming poison grants extra attack']],super.onStatusGainded(target))
    }
  }
  perk["PerkPoisonRush"]=PerkPoisonRush
  status["PoisonRush"]=PoisonRush
  reaction["PoisonRushReaction"]=PoisonRushReaction
}
const module_name = "PoisonRush"
const module_dependency = ["Poison"]
export { register, module_name, module_dependency}
