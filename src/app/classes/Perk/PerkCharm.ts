import { SpecialAttack } from "../Items/SpecialAttack/SpecialAttack";
import { SpecialCharm } from "../Items/SpecialAttack/SpecialCharm";
import { Perk } from "./Perk";

export class PerkCharm extends Perk {
    get name() { return 'Charmer';}
    get specials(): SpecialAttack[] {return [new SpecialCharm(this.masterService)] }
}