export enum meleenameEnum {
  "MeleeUnharmed"="MeleeUnharmed",
  "MeleeTest"="MeleeTest",
};
export enum rangednameEnum{
  "RangedUnharmed"="RangedUnharmed",
  "RangedTest"="RangedTest",
}
export enum shieldnameEnum{
  "ShieldNoShield"="ShieldNoShield",
  "ShieldTest"="ShieldTest",
  "ShieldGuard"="ShieldGuard",
}
export enum armornameEnum{
  "ArmorNoArmor"="ArmorNoArmor",
  "ArmorTest"="ArmorTest",
}
export enum specialsnameEnum{
  'OnePunch'='OnePunch',
  'Charm'='Charm',
  'Fright'='Fright',
  'Grab'='Grab',
}
export enum itemsEnum{
  'item-test'='item-test',
  'PoisonPill'='PoisonPill',
}
export type meleename = `${meleenameEnum}`;
export type rangedname =`${rangednameEnum}`;
export type shieldname =`${shieldnameEnum}`;
export type armorname = `${armornameEnum}`;
export type weaponname = meleename|rangedname;
export type equipmentname = weaponname| shieldname| armorname;
export type specialsname = `${specialsnameEnum}`;
export type itemname = equipmentname|specialsname|`${itemsEnum}`;
