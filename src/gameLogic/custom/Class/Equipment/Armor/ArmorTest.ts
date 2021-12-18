import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { CalculatedStats, characterStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Armor } from "src/gameLogic/custom/Class/Equipment/Armor/Armor";
import { armorname } from "src/gameLogic/custom/Class/Items/Item.type";

export class ArmorTest extends Armor
{
  protected _stats_modifier:CalculatedStats = {physical_defence:20,initiative:-5};
  protected _resistance_stats:ResistanceStats = {pierceresistance:10}
  get name(): armorname { return "Armor Test"; }
  canEquip(character: Character): boolean { return true; }
}
