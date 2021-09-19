import { MasterService } from "src/app/classes/masterService";
import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { pushBattleActionOutput } from "src/app/htmlHelper/htmlHelper.functions";
import { Character } from "../../../Character";
import { StatusBattle } from "../../StatusBattle";

export class StatusRestrained extends StatusBattle
{
  protected DURATION: number = 4;

  constructor(masterService:MasterService)
  {
      super(masterService)
  }

  get description(): string {
      return 'Being grabbed by something impedes movements.'
  }
  protected effect(target: Character): ActionOutput {
      target.roundStats.speed = 0;
      return [[],[`${target.name} is being like tied or something`]];
  }
  get name(): statusname {
      return 'Restrained';
  }
  onStatusRemoved(target: Character): ActionOutput
  { return pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger being grappled`]])}

  get tags(): tag[] { return super.tags.concat(['prone','restrained'])}
}
