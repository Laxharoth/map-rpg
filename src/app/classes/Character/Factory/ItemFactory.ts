import { armornameEnum, meleenameEnum, rangednameEnum, shieldnameEnum, specialsnameEnum } from './../../../customTypes/itemnames';
import { itemname, itemsEnum } from "src/app/customTypes/itemnames";
import { ArmorNoArmor } from "../../Equipment/Armor/ArmorNoArmor";
import { ArmorTest } from "../../Equipment/Armor/ArmorTest";
import { Equipment as Item } from "../../Equipment/Equipment";
import { ShieldNoShield } from "../../Equipment/Shield/ShieldNoShield";
import { ShieldTest } from "../../Equipment/Shield/ShieldTest";
import { MeleeTest } from "../../Equipment/Weapon/Melee/MeleeTest";
import { MeleeUnharmed } from "../../Equipment/Weapon/Melee/MeleeUnharmed";
import { RangedTest } from "../../Equipment/Weapon/Ranged/RangedTest";
import { RangedUnharmed } from "../../Equipment/Weapon/Ranged/RangedUnharmed";
import { MasterService } from "src/app/service/master.service";
import { ItemTest } from '../../Items/ItemTest';

/**
 * Creates an Item with the given itemname
 *
 * @export
 * @param {MasterService} masterService The master service
 * @param {itemname} itemName The itemname
 * @param {{[key: string]: any}} options The options from the item created with the  storeable.toJson
 * @return {Item} An Item with the loaded options
 */
export function ItemFactory(masterService:MasterService,itemName:itemname,options:{amount?:number,basePrice?:number}):Item
{
  const item = new ItemSwitcher[itemName](masterService);
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
