import { Description, DescriptionOptions, nextOption } from 'src/app/classes/Descriptions/Description';
import { Subscription } from 'rxjs';
import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { Character } from "../Character";
import { TimedStatus } from "./TimedStatus";
import { pushBattleActionOutput } from 'src/app/htmlHelper/htmlHelper.functions';

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
