export type meleename = 'hand'|
                        'Melee test';
export type rangedname ='a rock'|
                        'Ranged Test';
export type shieldname ='No shield'|
                        'Shield test';
export type armorname = 'No Armor'|
                        'Armor Test';
export type weaponname = meleename|rangedname;
export type itemname = weaponname| shieldname| armorname;
