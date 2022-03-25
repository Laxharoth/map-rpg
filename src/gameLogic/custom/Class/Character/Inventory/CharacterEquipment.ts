import { Shield, ShieldNoShield } from 'src/gameLogic/custom/Class/Equipment/Shield';
import { Armor, ArmorNoArmor } from 'src/gameLogic/custom/Class/Equipment/Armor';
import { RangedWeapon, RangedUnharmed } from 'src/gameLogic/custom/Class/Equipment/Weapon/RangedWeapon';
import { MeleeWeapon, MeleeUnharmed } from 'src/gameLogic/custom/Class/Equipment/Weapon/MeleeWeapon';
import { MasterService } from 'src/app/service/master.service';
import { Character } from '../Character';
import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { ItemStoreable } from '../../Items/Item';
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { removeModifier } from '../StatsModifier';

export class CharacterEquipment implements storeable{
  readonly type:string="CharacterEquipment"
  private readonly masterService: MasterService;
  private static __meleeUnharmed__:MeleeUnharmed;
  private static __rangedUnharmed__:RangedUnharmed;
  private static __noArmor__:ArmorNoArmor;
  private static __noShield__:ShieldNoShield;

  /** * The currently equiped melee weapon. */
  protected _meleeWeapon:MeleeWeapon|null;
  get meleeWeapon():MeleeWeapon { return this._meleeWeapon || CharacterEquipment.__meleeUnharmed__ }
  set meleeWeapon(equipment:MeleeWeapon){this._meleeWeapon=equipment}
  /** * The currently equiped rangedWeapon. */
  protected _rangedWeapon:RangedWeapon|null;
  get rangedWeapon():RangedWeapon { return this._rangedWeapon || CharacterEquipment.__rangedUnharmed__ }
  set rangedWeapon(equipment:RangedWeapon){this._rangedWeapon=equipment}
  /** * *The currently equiped armor. */
  protected _armor:Armor|null;
  get armor():Armor { return this._armor || CharacterEquipment.__noArmor__}
  set armor(equipment:Armor){this._armor=equipment}
  /** * The currently equiped shield. */
  protected _shield:Shield|null;
  get shield():Shield { return this._shield || CharacterEquipment.__noShield__}
  set shield(equipment:Shield){this._shield=equipment}

  constructor(masterService:MasterService){
    this.masterService = masterService;
    this.initializeUnharmed();
    this._meleeWeapon = null;
    this._rangedWeapon = null;
    this._armor = null;
    this._shield = null;
  }
  /** Unequip melee weapon and adds it to the inventory. */
   unequipMelee(character:Character){
     const melee = this._meleeWeapon;
     if(melee)melee.amount++
     this._meleeWeapon = null;
     character.inventory.addItem(melee);
     melee&&removeModifier(character,melee)
   }
   /** Unequip ranged weapon and adds it to the inventory. */
   unequipRanged(character:Character){
     const ranged = this._rangedWeapon;
     if(ranged)ranged.amount++;
     this._rangedWeapon = null;
     character.inventory.addItem(ranged);
     ranged&&removeModifier(character,ranged)
   }
   /** Unequip armor and adds it to the inventory. */
   unequipArmor(character:Character){
     const armor = this._armor;
     if(armor)armor.amount++;
     this._armor = null;
     character.inventory.addItem(armor);
     armor&&removeModifier(character,armor)
   }
   /** Unequip shield and adds it to the inventory. */
   unequipShield(character:Character){
     const shield = this._shield;
     if(shield)shield.amount++;
     this._shield = null;
     character.inventory.addItem(shield);
     shield&&removeModifier(character,shield)
   }
   /** Initializes the unharmed equpments. */
  private initializeUnharmed() {
    if(!CharacterEquipment.__meleeUnharmed__){
      CharacterEquipment.__meleeUnharmed__   = new MeleeUnharmed(this.masterService);
      CharacterEquipment.__rangedUnharmed__  = new RangedUnharmed(this.masterService);
      CharacterEquipment.__noArmor__         = new ArmorNoArmor(this.masterService);
      CharacterEquipment.__noShield__        = new ShieldNoShield(this.masterService);
    }
  }
  *[Symbol.iterator](){
    yield this.meleeWeapon;
    yield this.rangedWeapon;
    yield this.armor;
    yield this.shield;
  }
  toJson():CharacterEquipmentOptions{
    return {
      Factory: "Item",
      type: "",
      melee:this._meleeWeapon?this._meleeWeapon.toJson():null,
      ranged:this._rangedWeapon?this._rangedWeapon.toJson():null,
      armor:this._armor?this._armor.toJson():null,
      shield:this._shield?this._shield.toJson():null,
    }
  }
  fromJson(options:CharacterEquipmentOptions){
    options.melee&&(this._meleeWeapon = ItemFactory(this.masterService, options.melee) as MeleeWeapon);
    options.ranged&&(this._rangedWeapon = ItemFactory(this.masterService, options.ranged) as RangedWeapon);
    options.armor&&(this._armor = ItemFactory(this.masterService, options.armor) as Armor);
    options.shield&&(this._shield = ItemFactory(this.masterService, options.shield) as Shield);
  }
}
export type CharacterEquipmentOptions = {
  Factory: "Item";
  type: string;
  melee:ItemStoreable|null;
  ranged:ItemStoreable|null;
  armor:ItemStoreable|null;
  shield:ItemStoreable|null;
}
