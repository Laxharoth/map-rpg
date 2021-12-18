import { MasterService } from "src/app/service/master.service";
import { ActionOutput, Character } from 'src/gameLogic/custom/Class/Character/Character';
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { StatusBattle } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

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
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} is being like tied or something`]]; }
  applyModifiers(character: Character): void {
      character.calculated_stats.initiative = 0;
  }
  get name(): statusname {
      return 'Restrained';
  }
  onStatusRemoved(target: Character): ActionOutput
  { return pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger being grappled`]])}

  get tags(): tag[] { return super.tags.concat(['prone','restrained'])}
}
