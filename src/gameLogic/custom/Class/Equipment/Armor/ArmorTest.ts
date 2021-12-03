import { Character, characterStats } from "src/gameLogic/custom/Class/Character/Character";
import { Armor } from "src/gameLogic/custom/Class/Equipment/Armor/Armor";
import { armorname } from "src/gameLogic/custom/Class/Items/Item.type";

export class ArmorTest extends Armor
{
  protected equipmentStats: characterStats = {defence:20,pierceresistance:10,speed:-5};
  get name(): armorname { return "Armor Test"; }
  canEquip(character: Character): boolean { return true; }
}
