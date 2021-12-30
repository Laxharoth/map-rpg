import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { StatusGrappled } from "src/gameLogic/custom/Class/Status/StatusTemporal/Ailments/StatusGrappled";
import { StatusGrappling } from "src/gameLogic/custom/Class/Status/StatusTemporal/Ailments/StatusGrappling";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { GameElementDescriptionSection } from "../../GameElementDescription/GameElementDescription";

export class SpecialGrab extends SpecialAttack
{
  protected COOLDOWN = 6;
  get name(): specialsname { return 'Grab' }
  get isPartyUsable(): boolean { return false }
  get isEnemyUsable(): boolean { return true }
  get isSelfUsable(): boolean { return false }
  get isSingleTarget(): boolean { return true }
  get description(): GameElementDescriptionSection[]{ return [
    {name: "description",section_items:[{name: "description",value:'grab'}]},
    ...super.description
  ]}

  protected _itemEffect(user:Character,target: Character): ActionOutput {
      const description:ActionOutput = [[],[]];
      pushBattleActionOutput(user.addStatus(new StatusGrappling(this.masterService,target)),description)
      pushBattleActionOutput(target.addStatus(new StatusGrappled(this.masterService,user)),description)
      return description;
  }
}
