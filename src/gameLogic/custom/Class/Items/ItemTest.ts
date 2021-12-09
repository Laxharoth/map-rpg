import { ActionOutput, Character } from "src/gameLogic/custom/Class/Character/Character";
import { nextOption } from "src/gameLogic/custom/Class/Descriptions/CommonOptions";
import { Description } from "src/gameLogic/custom/Class/Descriptions/Description";
import { GameItem } from "src/gameLogic/custom/Class/Items/Item";
import { itemname } from "src/gameLogic/custom/Class/Items/Item.type";

export class ItemTest extends GameItem
{
  get name(): itemname { return 'item-test'; }
  get isBattleUsable(): boolean { return false; }
  get isPartyUsable(): boolean { return true; }
  get isEnemyUsable(): boolean { return false; }
  get isSelfUsable(): boolean { return true; }
  get isSingleTarget(): boolean { return false; }
  protected _itemEffect(user:Character,target: Character): ActionOutput
  {
    const healHitPoints = target.healHitPoints(10);
    return [[this.itemEffectDescription(target, healHitPoints)],[]];
  }

  //Description
  private itemEffectDescription(target:Character, healHitPoints:number)
  {
    return new Description(function(){return `Heal ${target.name} ${healHitPoints}`},[nextOption(this.masterService)])
  }
}
