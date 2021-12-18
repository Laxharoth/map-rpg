import { ItemStoreable } from './../Class/Items/Item';
import { MasterService } from 'src/app/service/master.service';
import { ArmorNoArmor } from 'src/gameLogic/custom/Class/Equipment/Armor/Armor';
import { ArmorTest } from 'src/gameLogic/custom/Class/Equipment/Armor/ArmorTest';
import { ShieldNoShield } from 'src/gameLogic/custom/Class/Equipment/Shield/Shield';
import { ShieldTest } from 'src/gameLogic/custom/Class/Equipment/Shield/ShieldTest';
import { MeleeTest } from 'src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeTest';
import { MeleeUnharmed } from 'src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeWeapon';
import { RangedTest } from 'src/gameLogic/custom/Class/Equipment/Weapon/Ranged/RangedTest';
import { RangedUnharmed } from 'src/gameLogic/custom/Class/Equipment/Weapon/Ranged/RangedWeapon';
import { GameItem } from 'src/gameLogic/custom/Class/Items/Item';
import { armornameEnum, itemname, itemsEnum, meleenameEnum, rangednameEnum, shieldnameEnum } from 'src/gameLogic/custom/Class/Items/Item.type';
import { ItemTest } from 'src/gameLogic/custom/Class/Items/ItemTest';


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

/** @type {[key: string]:Item.constructor} */
const ItemSwitcher:{[key in meleenameEnum| rangednameEnum| shieldnameEnum| armornameEnum| itemsEnum]:any} = {
  'hand':MeleeUnharmed,
  'Melee test':MeleeTest,
  'a rock':RangedUnharmed,
  'Ranged Test':RangedTest,
  'No shield':ShieldNoShield,
  'Shield test':ShieldTest,
  'No Armor':ArmorNoArmor,
  'Armor Test':ArmorTest,
  'item-test':ItemTest
}
