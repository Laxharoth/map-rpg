import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { nextOption } from "src/gameLogic/custom/Class/Descriptions/CommonOptions";
import { Description } from "src/gameLogic/custom/Class/Descriptions/Description";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { StatusBattle } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class StatusParalisis extends StatusBattle {
  protected DURATION: number = 0;
  get name(): statusname { return 'Paralisis'; }
  get description(): string {
    return "The target can't move due to an energy shock.";
  }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} can't move`]] }
  onStatusGainded(target: Character): ActionOutput
  {
    switch(Math.floor(Math.random() * 7))
    {
      case 1:case 2:case 3: case 4:this.DURATION =1;break;
      case 5: case 6:this.DURATION=2; break;
      case 7: this.DURATION=3; break;
    }
    if(this.DURATION)
    {
      return pushBattleActionOutput(super.onStatusGainded(target), [
            [{
              descriptionData: () => `${target.name} has been paralized.`,
              options: [nextOption(this.masterService)],
              fixed_options: [null, null, null, null, null]
            }],
            []
          ])
    }
    return pushBattleActionOutput(super.onStatusGainded(target),[[],[`${target.name} resisted the paralisis.`]]);
  }
  onStatusRemoved(target: Character): ActionOutput
  { return pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger paralized.`]]); }
  canApply(target:Character): boolean
  { return super.canApply(target) && target.calculated_resistance.energyresistance<Math.random()*100; }
  get tags(): tag[] { return super.tags.concat(['paralized'])}
}
