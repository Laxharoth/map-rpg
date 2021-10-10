import { meleename } from 'src/app/customTypes/itemnames';
import { MasterService } from 'src/app/service/master.service';
import { characterStats, damageTypes } from '../../../../customTypes/customTypes';
import { Character } from '../../../Character/Character';
import { MeleeWeapon } from './MeleeWeapon'

export class MeleeTest extends MeleeWeapon
{
  protected accuracy: number = 100;
  constructor(masterService:MasterService)
  { super(masterService,{attack:20},{bluntdamage:30}) }
  get name(): meleename { return 'Melee test'; }
  canEquip(character: Character): boolean { return true; }
}
