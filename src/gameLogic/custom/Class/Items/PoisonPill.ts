import { StatusPoison } from './../Status/StatusTemporal/StatusPoison';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { Character } from '../Character/Character';
import { ActionOutput } from '../Character/Character.type';
import { itemname } from './Item.type';
export class PoisonPill extends GameItem
{
  get name(): itemname {return 'Poison Pill'}
  get isMapUsable(): boolean {return false; }
  get isPartyUsable(): boolean { return false; }
  protected _itemEffect(user: Character, target: Character): ActionOutput {
    const poison = new StatusPoison(this.masterService)
    //@ts-ignore
    poison.DURATION = 1;
    return target.addStatus(poison);
  }
}
