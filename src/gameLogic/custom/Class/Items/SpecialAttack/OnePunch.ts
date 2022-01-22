import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Description, DescriptionOptions } from "src/gameLogic/custom/Class/Descriptions/Description";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { GameElementDescriptionSection } from "../../GameElementDescription/GameElementDescription";

export class OnePunch extends SpecialAttack
{
  protected COOLDOWN: number = Infinity;
  get name(): specialsname { return "One Punch"; }
  get isPartyUsable(): boolean { return false; }
  get isEnemyUsable(): boolean { return true; }
  get isSelfUsable(): boolean { return false; }
  get isSingleTarget(): boolean { return true; }
  protected _itemEffect(user:Character ,target: Character): ActionOutput {
      target.takeDamage(Infinity);
      const specialDescription:ActionOutput = [[this.specialDescription(user,target)],[]]
      return specialDescription;
  }
  get added_description_sections(): GameElementDescriptionSection[]
  { return [ {name: "description",section_items:[{name: "description",value:'One-shots the target'}]}, ]}
  ////////////////////
  /// SPECIAL DESCRIPTION
  ////////////////////
  private specialDescriptionOptions = { text:'NEXT!!',action:()=>{this.masterService.descriptionHandler.nextDescription(false)},disabled: false }
  private specialDescription(user: Character, target: Character):Description{
    return {
      descriptionData: () => `${user.name.toUpperCase()} OHKO ${target.name}!`,
      options: [this.specialDescriptionOptions],
      fixed_options: [null, null, null, null, null]
    }
  }
}
