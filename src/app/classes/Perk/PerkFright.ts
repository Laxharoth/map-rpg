import { SpecialFright } from "../Items/SpecialAttack/SpecialFright";
import { Perk } from "./Perk";

export class PerkFright extends Perk {
    get name(): string { return 'Frighter' }
    
    get specials(){return [new SpecialFright(this.masterService)]}
}