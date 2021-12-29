export enum meleenameEnum {
  "hand"="hand",
  "Melee test"="Melee test",
};
export enum rangednameEnum{
  "a rock"="a rock",
  "Ranged Test"="Ranged Test",
}
export enum shieldnameEnum{
  "No shield"="No shield",
  "Shield test"="Shield test",
  "Guard Shield"="Guard Shield",
}
export enum armornameEnum{
  "No Armor"="No Armor",
  "Armor Test"="Armor Test",
}
export enum specialsnameEnum{
  'One Punch'='One Punch',
  'Charm'='Charm',
  'Fright'='Fright',
  'Grab'='Grab',
}
export enum itemsEnum{
  'item-test'='item-test',
  'Poison Pill'='Poison Pill',
}
export type meleename = `${meleenameEnum}`;
export type rangedname =`${rangednameEnum}`;
export type shieldname =`${shieldnameEnum}`;
export type armorname = `${armornameEnum}`;
export type weaponname = meleename|rangedname;
export type equipmentname = weaponname| shieldname| armorname;
export type specialsname = `${specialsnameEnum}`;
export type itemname = equipmentname|specialsname|`${itemsEnum}`;
