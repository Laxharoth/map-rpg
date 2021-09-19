import { Character } from "src/app/classes/Character/Character";
import { characterStats, damageTypes } from "src/app/customTypes/customTypes";
import { MeleeWeapon } from "./MeleeWeapon";
import { tag } from 'src/app/customTypes/tags';
import { OnePunch } from "src/app/classes/Items/SpecialAttack/OnePunch";
import { SpecialAttack } from "src/app/classes/Items/SpecialAttack/SpecialAttack";
import { MasterService } from "src/app/classes/masterService";
import { meleename } from "src/app/customTypes/itemnames";

export class MeleeUnharmed extends MeleeWeapon
{
  readonly onePunch = new OnePunch(this.masterService);
  protected statsModifier: characterStats = {evasion:30};
  protected damageTypes:damageTypes = {bluntdamage:10};
  maxStack = 0;
  protected accuracy: number = 100;
  constructor(masterService:MasterService) { super(masterService) }
  get name(): meleename { return 'hand'; }
  canEquip(character: Character): boolean { return true; }
  get tags(): tag[] { return ['melee unharmed']; }
  get isSingleTarget(): boolean { return true;}
  get specials():SpecialAttack[]{return [this.onePunch]}
}
