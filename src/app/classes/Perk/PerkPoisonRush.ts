import { tag } from "src/app/customTypes/tags";
import { Reaction } from "../Character/Reaction/Reaction";
import { PoisonRush } from "../Character/Reaction/ReactionPoisonRush";
import { Perk } from "./Perk";

export class PerkPoisonRush extends Perk {
  readonly poisonRush = new PoisonRush(this.masterService);
  get name(){ return 'Posion Rush';}
  get tags(): tag[] { return [] }

  get reactions(): Reaction[] {return [this.poisonRush]}
}
