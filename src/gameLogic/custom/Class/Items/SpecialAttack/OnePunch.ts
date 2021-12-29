import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { Description, DescriptionOptions } from "src/gameLogic/custom/Class/Descriptions/Description";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";

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
  get description(): string {return 'One-shots the target';}
  ////////////////////
  /// SPECIAL DESCRIPTION
  ////////////////////
  private specialDescriptionOptions = new DescriptionOptions('NEXT!!',()=>{this.masterService.descriptionHandler.nextDescription(false)})
  private specialDescription =(user:Character,target:Character)=> new Description(()=>`${user.name.toUpperCase()} OHKO ${target.name}!`,[this.specialDescriptionOptions])
}
