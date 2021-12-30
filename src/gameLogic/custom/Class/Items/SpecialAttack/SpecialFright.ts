import { GameElementDescriptionSection } from './../../GameElementDescription/GameElementDescription';
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { StatusFright } from "src/gameLogic/custom/Class/Status/StatusTemporal/Ailments/StatusFright";

export class SpecialFright extends SpecialAttack
{
  protected COOLDOWN: number = 4;
  get name(): specialsname { return 'Fright' }
  get isPartyUsable(): boolean { return false }
  get isEnemyUsable(): boolean { return true }
  get isSelfUsable(): boolean { return false }
  get isSingleTarget(): boolean { return true }
  get description(): GameElementDescriptionSection[]{ return [
    {name: "description",section_items:[{name: "description",value:'fright'}]},
    ...super.description
  ]}
  protected _itemEffect(user:Character,target: Character): ActionOutput
  {
      return target.addStatus(new StatusFright(this.masterService,target,user))
  }
}
