import { SpecialAttack } from "../Items/SpecialAttack/SpecialAttack";
import { SpecialGrab } from "../Items/SpecialAttack/SpecialGrab";
import { Perk } from "./Perk";

export class PerkGrappler extends Perk {
    readonly specialGrab = new SpecialGrab(this.masterService)
    get name(): string { return 'Grappler'; }

    get specials() :SpecialAttack[]{return [this.specialGrab]}
}
