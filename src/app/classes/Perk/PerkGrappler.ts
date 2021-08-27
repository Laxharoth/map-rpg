import { SpecialAttack } from "../Items/SpecialAttack/SpecialAttack";
import { SpecialGrab } from "../Items/SpecialAttack/SpecialGrab";
import { Perk } from "./Perk";

export class PerkGrappler extends Perk {
    get name(): string { return 'Grappler'; }
    
    get specials() :SpecialAttack[]{return [new SpecialGrab(this.masterService)]}
}