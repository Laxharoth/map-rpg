import { Reaction } from "src/gameLogic/custom/Class/Character/Reaction/Reaction";
import { PoisonRush } from "src/gameLogic/custom/Class/Character/Reaction/ReactionPoisonRush";
import { Perk } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

export class PerkPoisonRush extends Perk {
  readonly poisonRush = new PoisonRush(this.masterService);
  get name():perkname{ return 'Posion Rush';}
  get tags(): tag[] { return [] }

  get reactions(): Reaction[] {return [this.poisonRush]}
}
