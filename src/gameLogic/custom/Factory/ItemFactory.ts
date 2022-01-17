import { MeleeWeapon } from 'src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeWeapon';
import { ItemStoreable } from './../Class/Items/Item';
import { MasterService } from 'src/app/service/master.service';
import { Armor, ArmorNoArmor } from 'src/gameLogic/custom/Class/Equipment/Armor/Armor';
import { ArmorTest } from 'src/gameLogic/custom/Class/Equipment/Armor/ArmorTest';
import { Shield, ShieldNoShield } from 'src/gameLogic/custom/Class/Equipment/Shield/Shield';
import { ShieldTest } from 'src/gameLogic/custom/Class/Equipment/Shield/ShieldTest';
import { MeleeTest } from 'src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeTest';
import { MeleeUnharmed } from 'src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeWeapon';
import { RangedTest } from 'src/gameLogic/custom/Class/Equipment/Weapon/Ranged/RangedTest';
import { RangedUnharmed, RangedWeapon } from 'src/gameLogic/custom/Class/Equipment/Weapon/Ranged/RangedWeapon';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { armornameEnum, itemsEnum, meleenameEnum, rangednameEnum, shieldnameEnum } from 'src/gameLogic/custom/Class/Items/Item.type';
import { ItemTest } from 'src/gameLogic/custom/Class/Items/ItemTest';
import { ShieldGuard } from '../Class/Equipment/Shield/ShieldGuard';
import { FactoryFunction } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { status_factory } from './StatusFactory';
import { add_module, Factory } from 'src/gameLogic/core/Factory/Factory';

export type item_factory_function = (masterService: MasterService, options: ItemStoreable)=>GameItem
/**
 * Creates an Item with the given itemname
 *
 * @export
 * @param {MasterService} masterService The master service
 * @param {itemname} itemName The itemname
 * @param {{[key: string]: any}} options The options from the item created with the  storeable.toJson
 * @return {Item} An Item with the loaded options
 */
export function ItemFactory(masterService:MasterService,options:ItemStoreable):GameItem
{
  const item = new ItemSwitcher[options.type](masterService);
  item.fromJson(options)
  return item;
}

interface ItemConstructor { new (masterService:MasterService):GameItem }
//@ts-ignore
const ItemSwitcher:{[key in meleenameEnum| rangednameEnum| shieldnameEnum| armornameEnum| itemsEnum]:ItemConstructor} = {
  'hand':MeleeUnharmed,
  'Melee test':MeleeTest,
  'a rock':RangedUnharmed,
  'Ranged Test':RangedTest,
  'No shield':ShieldNoShield,
  'Shield test':ShieldTest,
  'No Armor':ArmorNoArmor,
  'Armor Test':ArmorTest,
  'item-test':ItemTest,
  'Guard Shield':ShieldGuard,
  // 'Poison Pill':PoisonPill,
}

export type register_item_function = (
  ItemSwitcher:{[key: string]:ItemConstructor},
  ItemConstructors:item_constructors,
  Factory:FactoryFunction
  )=>void;
type item_module = { register:register_item_function }
type item_constructors =  {
  GameItem: typeof GameItem;
  MeleeWeapon: typeof MeleeWeapon;
  RangedWeapon: typeof RangedWeapon;
  Shield: typeof Shield;
  Armor: typeof Armor;
}
export const  ItemConstructors = {
  GameItem,
  MeleeWeapon,
  RangedWeapon,
  Shield,
  Armor,
}
export function register_item(item_module:item_module):void
{
  //@ts-ignore
  const  { register, module_name, module_dependency } = item_module;
  add_module({
    register_function(){register(ItemSwitcher,ItemConstructors,Factory)},
    module_name, module_dependency
  })
}
