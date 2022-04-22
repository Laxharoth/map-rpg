import { Shield, ShieldNoShield } from 'src/gameLogic/custom/Class/Equipment/Shield';
import { Armor, ArmorNoArmor } from 'src/gameLogic/custom/Class/Equipment/Armor';
import { RangedWeapon, RangedUnharmed } from 'src/gameLogic/custom/Class/Equipment/Weapon/RangedWeapon';
import { MeleeWeapon, MeleeUnharmed } from 'src/gameLogic/custom/Class/Equipment/Weapon/MeleeWeapon';
import { MasterService } from 'src/app/service/master.service';
import { Character } from '../Character';
import { Storeable } from 'src/gameLogic/core/Factory/Factory';
import { ItemStoreable } from '../../Items/Item';
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { removeModifier } from '../StatsModifier';

export class CharacterEquipment implements Storeable{
  readonly type:string="CharacterEquipment"
  private readonly masterService: MasterService;
  private static _MELEE_UNHARMED_:MeleeUnharmed;
  private static _RANGED_UNHARMED_:RangedUnharmed;
  private static _NO_ARMOR_:ArmorNoArmor;
  private static _NO_SHIELD_:ShieldNoShield;

  /** * The currently equiped melee weapon. */
  protected _meleeWeapon:MeleeWeapon|null;
  get meleeWeapon():MeleeWeapon { return this._meleeWeapon || CharacterEquipment._MELEE_UNHARMED_ }
  set meleeWeapon(equipment:MeleeWeapon){this._meleeWeapon=equipment}
  /** * The currently equiped rangedWeapon. */
  protected _rangedWeapon:RangedWeapon|null;
  get rangedWeapon():RangedWeapon { return this._rangedWeapon || CharacterEquipment._RANGED_UNHARMED_ }
  set rangedWeapon(equipment:RangedWeapon){this._rangedWeapon=equipment}
  /** * *The currently equiped armor. */
  protected _armor:Armor|null;
  get armor():Armor { return this._armor || CharacterEquipment._NO_ARMOR_}
  set armor(equipment:Armor){this._armor=equipment}
  /** * The currently equiped shield. */
  protected _shield:Shield|null;
  get shield():Shield { return this._shield || CharacterEquipment._NO_SHIELD_}
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
     if(melee)
      removeModifier(character,melee)
   }
   /** Unequip ranged weapon and adds it to the inventory. */
   unequipRanged(character:Character){
     const ranged = this._rangedWeapon;
     if(ranged)ranged.amount++;
     this._rangedWeapon = null;
     character.inventory.addItem(ranged);
     if(ranged)
      removeModifier(character,ranged)
   }
   /** Unequip armor and adds it to the inventory. */
   unequipArmor(character:Character){
     const armor = this._armor;
     if(armor)armor.amount++;
     this._armor = null;
     character.inventory.addItem(armor);
     if(armor)
      removeModifier(character,armor)
   }
   /** Unequip shield and adds it to the inventory. */
   unequipShield(character:Character){
     const shield = this._shield;
     if(shield)shield.amount++;
     this._shield = null;
     character.inventory.addItem(shield);
     if(shield)
      removeModifier(character,shield)
   }
   /** Initializes the unharmed equpments. */
  private initializeUnharmed() {
    if(!CharacterEquipment._MELEE_UNHARMED_){
      CharacterEquipment._MELEE_UNHARMED_   = new MeleeUnharmed(this.masterService);
      CharacterEquipment._RANGED_UNHARMED_  = new RangedUnharmed(this.masterService);
      CharacterEquipment._NO_ARMOR_         = new ArmorNoArmor(this.masterService);
      CharacterEquipment._NO_SHIELD_        = new ShieldNoShield(this.masterService);
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
    if(options.melee)
      this._meleeWeapon = ItemFactory(this.masterService, options.melee) as MeleeWeapon;
    if(options.ranged)
      this._rangedWeapon = ItemFactory(this.masterService, options.ranged) as RangedWeapon;
    if(options.armor)
      this._armor = ItemFactory(this.masterService, options.armor) as Armor;
    if(options.shield)
      this._shield = ItemFactory(this.masterService, options.shield) as Shield;
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
