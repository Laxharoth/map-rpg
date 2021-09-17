import { characterStats } from "src/app/customTypes/customTypes";
import { shieldname } from "src/app/customTypes/itemnames";
import { Character } from "../../Character/Character";
import { Shield } from "./Shield";

export class ShieldTest extends Shield
{
  protected statsModifier: characterStats = {defence:20, bluntresistance:10,pierceresistance:5};
  get name(): shieldname { return 'Shield test'; }
  canEquip(character: Character): boolean { return true; }
}
