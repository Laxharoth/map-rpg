import { ActionOutput, Character } from "src/gameLogic/custom/Class/Character/Character";
import { Description, DescriptionOptions } from "src/gameLogic/custom/Class/Descriptions/Description";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";

export class OnePunch extends SpecialAttack
{
  get name(): specialsname { return "One Punch"; }
  get isPartyUsable(): boolean { return false; }
  get isEnemyUsable(): boolean { return true; }
  get isSelfUsable(): boolean { return false; }
  get isSingleTarget(): boolean { return true; }
  protected _itemEffect(user:Character ,target: Character): ActionOutput {
      this.cooldown  =  Infinity;
      target.takeDamage(Infinity);
      const specialDescription:ActionOutput = [[this.specialDescription(user,target)],[]]
      return specialDescription;
  }

  ////////////////////
  /// SPECIAL DESCRIPTION
  ////////////////////
  private specialDescriptionOptions = new DescriptionOptions('NEXT!!',()=>{this.masterService.descriptionHandler.nextDescription(false)})
  private specialDescription =(user:Character,target:Character)=> new Description(()=>`${user.name.toUpperCase()} OHKO ${target.name}!`,[this.specialDescriptionOptions])
}
