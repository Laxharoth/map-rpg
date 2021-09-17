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
import { MasterService } from "../../masterService";
import { ItemTest } from '../../Items/ItemTest';

export function ItemFactory(masterService:MasterService,equipmentName:itemname,options:{[key: string]: any}):Item
{
  const equipment = new ItemSwitcher[equipmentName](masterService);
  equipment.fromJson(options)
  return equipment;
}

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
