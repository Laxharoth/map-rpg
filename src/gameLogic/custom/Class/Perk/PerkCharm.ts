import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { SpecialCharm } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialCharm";
import { Perk } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";

export class PerkCharm extends Perk {
  readonly charmSpecial = new SpecialCharm(this.masterService)
  get name():perkname { return 'Charmer';}
  get specials(): SpecialAttack[] {return [this.charmSpecial] }
}
