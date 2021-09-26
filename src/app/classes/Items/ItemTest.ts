import { ActionOutput } from "src/app/customTypes/customTypes";
import { itemname } from "src/app/customTypes/itemnames";
import { Character } from "../Character/Character";
import { nextOption } from "../Descriptions/CommonOptions";
import { Description } from "../Descriptions/Description";
import { Item } from "./Item";

export class ItemTest extends Item
{
  get name(): itemname { return 'item-test'; }
  get isBattleUsable(): boolean { return false; }
  get isPartyUsable(): boolean { return true; }
  get isEnemyUsable(): boolean { return false; }
  get isSelfUsable(): boolean { return true; }
  get isSingleTarget(): boolean { return false; }
  itemEffect(user:Character,target: Character): ActionOutput
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
