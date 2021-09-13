import { perkname } from "src/app/customTypes/perkname";
import { SpecialAttack } from "../Items/SpecialAttack/SpecialAttack";
import { SpecialCharm } from "../Items/SpecialAttack/SpecialCharm";
import { Perk } from "./Perk";

export class PerkCharm extends Perk {
  readonly charmSpecial = new SpecialCharm(this.masterService)
  get name():perkname { return 'Charmer';}
  get specials(): SpecialAttack[] {return [this.charmSpecial] }
}
