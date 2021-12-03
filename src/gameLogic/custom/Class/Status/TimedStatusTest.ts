
import { ActionOutput, Character } from 'src/gameLogic/custom/Class/Character/Character';
import { Description, DescriptionOptions } from "src/gameLogic/custom/Class/Descriptions/Description";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { TimedStatus } from "src/gameLogic/custom/Class/Status/TimedStatus";
import { pushBattleActionOutput } from 'src/gameLogic/custom/functions/htmlHelper.functions';

export class TimedStatusTest extends TimedStatus
{
  protected duration: number = 20;

  get name(): statusname { return "TimedStatusTest"; }
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
  private nextButton:DescriptionOptions =  new DescriptionOptions( "next",()=>{ this.masterService.descriptionHandler.nextDescription(); });
  private nextDescription = (target: Character)=> new Description(()=>`Remove Test Description from  ${target.name}`,[this.nextButton])
}