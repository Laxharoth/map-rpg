
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Scene, SceneOptions } from "src/gameLogic/custom/Class/Scene/Scene";
import { TimedStatus } from "src/gameLogic/custom/Class/Status/TimedStatus";
import { pushBattleActionOutput } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { nextOption } from '../Scene/CommonOptions';

export class TimedStatusTest extends TimedStatus
{
  protected duration: number = 20;

  readonly type:"TimedStatusTest"="TimedStatusTest";
  get name(): string { return "Timed Status Test"; }
  get description(): string { return 'testing only'}
  protected effect(target: Character): ActionOutput { return [[],[]] }

  onStatusRemoved(target: Character)
  {
    const messages:ActionOutput = [[this.nextScene(target)],[]];
    return pushBattleActionOutput(super.onStatusRemoved(target),messages);
  }

  /////////////////////////////////
  //// TEST SCENE
  /////////////////////////////////
  private nextButton:SceneOptions =  nextOption(this.masterService)
  private nextScene(target: Character): Scene {
    return {
      sceneData: () => `Remove Test Description from  ${target.name}`,
      options: [this.nextButton],
      fixedOptions: [null, null, null, null, null]
    }
  }
}
