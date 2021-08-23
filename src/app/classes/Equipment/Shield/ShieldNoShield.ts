import { battleActionOutput } from "src/app/customTypes/customTypes";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../../Character/Character";
import { Shield } from "./Shield";

export class ShieldNoShield extends Shield
{
    get name(): string { return 'No shield'; }
    canEquip(character: Character): boolean { return false; }
    applyModifiers(character: Character): void { }
    get tags(): tag[] { return ['no shield']; }
    get isSingleTarget(): boolean { return true; }    
}