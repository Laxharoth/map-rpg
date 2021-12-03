import { SpecialFright } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialFright";
import { Perk } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";

export class PerkFright extends Perk {
  readonly specialFright = new SpecialFright(this.masterService)
  get name(): perkname { return 'Frighter' }

  get specials(){return [this.specialFright]}
}
