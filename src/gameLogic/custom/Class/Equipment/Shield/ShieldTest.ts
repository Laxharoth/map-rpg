import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { CalculatedStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { shieldname } from "src/gameLogic/custom/Class/Items/Item.type";
import { Shield } from "src/gameLogic/custom/Class/Equipment/Shield/Shield";


export class ShieldTest extends Shield
{
  protected _stats_modifier:CalculatedStats = {physical_defence:20};
  protected _resistance_stats:ResistanceStats = {bluntresistance:10,pierceresistance:5}
  get name(): shieldname { return 'Shield test'; }
  canEquip(character: Character): boolean { return true; }
}
