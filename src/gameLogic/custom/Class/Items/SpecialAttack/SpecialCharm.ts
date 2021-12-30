import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { StatusCharm } from "src/gameLogic/custom/Class/Status/StatusTemporal/Ailments/StatusCharm";
import { pushBattleActionOutput } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { GameElementDescriptionSection } from "../../GameElementDescription/GameElementDescription";

export class SpecialCharm extends SpecialAttack
{
  protected COOLDOWN: number=6;
  get name(): specialsname { return 'Charm'; }
  get isPartyUsable(): boolean { return false; }
  get isEnemyUsable(): boolean { return true; }
  get isSelfUsable() : boolean { return false; }
  get isSingleTarget(): boolean { return true; }
  get description(): GameElementDescriptionSection[]{ return [
    {name: "description",section_items:[{name: "description",value:'charm'}]},
    ...super.description
  ]}
  protected _itemEffect(user:Character,target: Character): ActionOutput {
    return target.addStatus(new StatusCharm(this.masterService,user,target))
  }
}
