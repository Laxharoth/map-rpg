import { MasterService } from "src/app/service/master.service";
import { ActionOutput } from "src/app/customTypes/customTypes";
import { statusname } from "src/app/customTypes/statusnames";
import { tag } from "src/app/customTypes/tags";
import { Character } from "../../../Character";
import { StatusBattle, StatusPreventAttack } from "../../StatusBattle";

export class StatusCharm extends StatusBattle implements StatusPreventAttack
{
  discriminator:"StatusPreventAttack"="StatusPreventAttack";
  protected DURATION: number = 3;
  private _charmer:Character;
  private _charmed:Character;
  constructor(masterService:MasterService, charmer:Character, charmed:Character)
  {
      super(masterService)
      this._charmer = charmer;
      this._charmed = charmed;
  }
  get name(): statusname { return 'Charm'; }
  get description(): string {
    return "Can't hurt charmer";
  }
  protected effect(target: Character): ActionOutput { return [[],[`${this._charmed.name} is charmed by ${this._charmer.name}`]]}

  canAttack(target: Character): boolean {return this._charmer !== target;}
  preventAttackDescription(target: Character): ActionOutput { return [[],[`${this._charmed.name} is charmed and can't attack ${this._charmer.name}`]] }
  get tags(): tag[] { return super.tags.concat(['charm'])}
}
