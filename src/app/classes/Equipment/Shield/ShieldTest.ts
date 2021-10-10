import { characterStats } from "src/app/customTypes/customTypes";
import { shieldname } from "src/app/customTypes/itemnames";
import { MasterService } from "src/app/service/master.service";
import { Character } from "../../Character/Character";
import { Shield } from "./Shield";

export class ShieldTest extends Shield
{
  constructor(masterService:MasterService)
  { super(masterService,{defence:20, bluntresistance:10,pierceresistance:5}) }
  get name(): shieldname { return 'Shield test'; }
  canEquip(character: Character): boolean { return true; }
}
