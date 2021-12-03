import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { SpecialGrab } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialGrab";
import { Perk } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";

export class PerkGrappler extends Perk {
  readonly specialGrab = new SpecialGrab(this.masterService)
  get name():perkname { return 'Grappler'; }

  get specials() :SpecialAttack[]{return [this.specialGrab]}
}
