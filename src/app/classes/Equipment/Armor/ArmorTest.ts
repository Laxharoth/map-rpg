import { characterStats } from "src/app/customTypes/customTypes";
import { armorname } from "src/app/customTypes/itemnames";
import { Character } from "../../Character/Character";
import { Armor } from "./Armor";

export class ArmorTest extends Armor
{
  protected statsModifier: characterStats = {defence:20,pierceresistance:10,speed:-5};
  get name(): armorname { return "Armor Test"; }
  canEquip(character: Character): boolean { return true; }

}
