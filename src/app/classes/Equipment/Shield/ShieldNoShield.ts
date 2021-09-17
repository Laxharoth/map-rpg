import { ActionOutput } from "src/app/customTypes/customTypes";
import { shieldname } from "src/app/customTypes/itemnames";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../../Character/Character";
import { Shield } from "./Shield";

export class ShieldNoShield extends Shield
{
    protected statsModifier = {}
    get name(): shieldname { return 'No shield'; }
    canEquip(character: Character): boolean { return false; }
    get tags(): tag[] { return ['no shield']; }
    get isSingleTarget(): boolean { return true; }
}
