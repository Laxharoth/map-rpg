import { ActionOutput } from "src/app/customTypes/customTypes";
import { armorname } from "src/app/customTypes/itemnames";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../../Character/Character";
import { Armor } from "./Armor";

export class ArmorNoArmor extends Armor
{
  protected statsModifier = {}
  get name(): armorname { return 'No Armor'; }
  canEquip(character: Character): boolean { return false; }
  get tags(): tag[] { return ['no armor']; }
  get isSingleTarget(): boolean { return true; }
}
