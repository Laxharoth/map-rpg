import { itemname } from "src/app/customTypes/itemnames";
import { Item } from "./Item";

export class ItemTest extends Item
{
  get name(): itemname { return 'item-test'; }
  get isBattleUsable(): boolean { return false; }
  get isPartyUsable(): boolean { return false; }
  get isEnemyUsable(): boolean { return false; }
  get isSelfUsableOnly(): boolean { return false; }
  get isSingleTarget(): boolean { return true; }
}
