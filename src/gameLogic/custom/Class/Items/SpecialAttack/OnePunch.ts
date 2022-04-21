import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Scene } from "src/gameLogic/custom/Class/Scene/Scene";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { GameElementDescriptionSection } from "../../GameElementDescription/GameElementDescription";

export class OnePunch extends SpecialAttack
{
  protected COOLDOWN: number = Infinity;
  readonly type:"OnePunch"="OnePunch"
  get name(): string { return "One Punch"; }
  get isPartyUsable(): boolean { return false; }
  get isEnemyUsable(): boolean { return true; }
  get isSelfUsable(): boolean { return false; }
  get isSingleTarget(): boolean { return true; }
  protected _itemEffect(user:Character ,target: Character): ActionOutput {
      target.takeDamage(Infinity);
      const specialDescription:ActionOutput = [[this.specialScene(user,target)],[]]
      return specialDescription;
  }
  get added_description_sections(): GameElementDescriptionSection[]
  { return [ {type: "description",section_items:[{name: "description",value:'One-shots the target'}]}, ]}
  ////////////////////
  /// SPECIAL DESCRIPTION
  ////////////////////
  private specialDescriptionOptions = { text:'NEXT!!',action:()=>{this.masterService.sceneHandler.nextScene(false)},disabled: false }
  private specialScene(user: Character, target: Character):Scene{
    return {
      sceneData: () => `${user.name.toUpperCase()} OHKO ${target.name}!`,
      options: [this.specialDescriptionOptions],
      fixedOptions: [null, null, null, null, null]
    }
  }
}
