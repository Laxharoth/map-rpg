import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { nextOption } from "src/gameLogic/custom/Class/Scene/CommonOptions";
import { StatusBattle } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput, randomBetween } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class StatusParalisis extends StatusBattle {
  protected DURATION: number = 0;
  readonly type:"Paralisis"="Paralisis"
  get name(): string { return 'Paralisis'; }
  get description(): string {
    return "The target can't move due to an energy shock.";
  }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} can't move`]] }
  onStatusGainded(target: Character): ActionOutput{
    switch(randomBetween(0,7)){
      case 1:case 2:case 3: case 4:this.DURATION =1;break;
      case 5: case 6:this.DURATION=2; break;
      case 7: this.DURATION=3; break;
    }
    if(this.DURATION){
      return pushBattleActionOutput(super.onStatusGainded(target), [
            [{
              sceneData: () => `${target.name} has been paralized.`,
              options: [nextOption(this.masterService)],
              fixedOptions: [null, null, null, null, null]
            }],
            []
          ])
    }
    return pushBattleActionOutput(super.onStatusGainded(target),[[],[`${target.name} resisted the paralisis.`]]);
  }
  onStatusRemoved(target: Character): ActionOutput
  { return pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger paralized.`]]); }
  canApply(target:Character): boolean
  { return super.canApply(target) && target.calculatedResistance.energyresistance<Math.random()*100; }
  get tags(): tag[] { return super.tags.concat(['paralized'])}
}
