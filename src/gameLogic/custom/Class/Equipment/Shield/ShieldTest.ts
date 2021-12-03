import { Character, characterStats } from "src/gameLogic/custom/Class/Character/Character";
import { shieldname } from "src/gameLogic/custom/Class/Items/Item.type";
import { Shield } from "src/gameLogic/custom/Class/Equipment/Shield/Shield";


export class ShieldTest extends Shield
{
  protected equipmentStats:characterStats = {defence:20, bluntresistance:10,pierceresistance:5};
  get name(): shieldname { return 'Shield test'; }
  canEquip(character: Character): boolean { return true; }
}
