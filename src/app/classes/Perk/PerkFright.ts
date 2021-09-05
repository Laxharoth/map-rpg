import { SpecialFright } from "../Items/SpecialAttack/SpecialFright";
import { Perk } from "./Perk";

export class PerkFright extends Perk {
    readonly specialFright = new SpecialFright(this.masterService)
    get name(): string { return 'Frighter' }

    get specials(){return [this.specialFright]}
}
