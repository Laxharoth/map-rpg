import { MasterService } from 'src/app/service/master.service';
import { FactoryFunction } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { ArmorNoArmor } from 'src/gameLogic/custom/Class/Equipment/Armor';
import { ShieldNoShield } from 'src/gameLogic/custom/Class/Equipment/Shield';
import { MeleeUnharmed } from 'src/gameLogic/custom/Class/Equipment/Weapon/MeleeWeapon';
import { RangedUnharmed } from 'src/gameLogic/custom/Class/Equipment/Weapon/RangedWeapon';
import { GameItem, ItemStoreable } from 'src/gameLogic/custom/Class/Items/Item';
import { armornameEnum, itemsEnum, meleenameEnum, rangednameEnum, shieldnameEnum } from 'src/gameLogic/custom/Class/Items/Item.type';

export type item_factory_function = (masterService: MasterService, options: ItemStoreable)=>GameItem
/** Creates an Item with the given itemname */
export const ItemFactory:FactoryFunction<GameItem,ItemStoreable> = (masterService,options)=>{
  // @ts-ignore
  const item = new itemSwitcher[options.type](masterService);
  item.fromJson(options)
  return item;
}
//@ts-ignore
export const itemSwitcher:{[key in meleenameEnum| rangednameEnum| shieldnameEnum| armornameEnum| itemsEnum]:ItemConstructor} = {
  'MeleeUnharmed':MeleeUnharmed,
  'RangedUnharmed':RangedUnharmed,
  'ShieldNoShield':ShieldNoShield,
  'ArmorNoArmor':ArmorNoArmor,
}
export interface ItemConstructor { new (masterService:MasterService):GameItem }
