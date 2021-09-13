import { Description, nextOption } from "src/app/classes/Descriptions/Description";
import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../Character";
import { StatusBattle } from "../StatusBattle";

export class StatusParalisis extends StatusBattle {
  protected DURATION: number = 0;
  get name(): statusname { return 'Paralisis'; }
  get description(): string {
    return "The target can't move due to an energy shock.";
  }
  protected effect(target: Character): ActionOutput
  { return [[],[`${target.name} can't move`]] }
  onStatusGainded(target: Character): ActionOutput
  {
    switch(Math.floor(Math.random() * 7))
    {
      case 1:case 2:case 3: case 4:this.DURATION =1;break;
      case 5: case 6:this.DURATION=2; break;
      case 7: this.DURATION=3; break;
    }
    if(this.DURATION)
      return pushBattleActionOutput(super.onStatusGainded(target),[[new Description(()=>`${target.name} has been paralized.`,[nextOption(this.masterService)])],[]]);
    else
      return pushBattleActionOutput(super.onStatusGainded(target),[[],[`${target.name} resisted the paralisis.`]]);
  }
  onStatusRemoved(target: Character): ActionOutput
  { return pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger paralized.`]]); }
  canApply(target:Character): boolean
  { return super.canApply(target) && target.roundStats.energyresistance<Math.random()*100; }
  get tags(): tag[] { return super.tags.concat(['paralized'])}
}
