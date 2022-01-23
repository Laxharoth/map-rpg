
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Description, DescriptionOptions } from "src/gameLogic/custom/Class/Descriptions/Description";
import { TimedStatus } from "src/gameLogic/custom/Class/Status/TimedStatus";
import { pushBattleActionOutput } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { nextOption } from '../Descriptions/CommonOptions';

export class TimedStatusTest extends TimedStatus
{
  protected duration: number = 20;

  readonly type:"TimedStatusTest"="TimedStatusTest";
  get name(): string { return "Timed Status Test"; }
  get description(): string { return 'testing only'}
  protected effect(target: Character): ActionOutput { return [[],[]] }

  onStatusRemoved(target: Character)
  {
    const messages:ActionOutput = [[this.nextDescription(target)],[]];
    return pushBattleActionOutput(super.onStatusRemoved(target),messages);
  }

  /////////////////////////////////
  //// TEST DESCRIPTION
  /////////////////////////////////
  private nextButton:DescriptionOptions =  nextOption(this.masterService)
  private nextDescription(target: Character): Description {
    return {
      descriptionData: () => `Remove Test Description from  ${target.name}`,
      options: [this.nextButton],
      fixed_options: [null, null, null, null, null]
    }
  }
}
