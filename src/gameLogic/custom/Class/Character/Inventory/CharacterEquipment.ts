import { Shield, ShieldNoShield } from 'src/gameLogic/custom/Class/Equipment/Shield';
import { Armor, ArmorNoArmor } from 'src/gameLogic/custom/Class/Equipment/Armor';
import { RangedWeapon, RangedUnharmed } from 'src/gameLogic/custom/Class/Equipment/Weapon/RangedWeapon';
import { MeleeWeapon, MeleeUnharmed } from 'src/gameLogic/custom/Class/Equipment/Weapon/MeleeWeapon';
import { MasterService } from 'src/app/service/master.service';
import { Character } from '../Character';
import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { ItemStoreable } from '../../Items/Item';
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';

export class CharacterEquipment implements storeable
{
  private readonly masterService: MasterService;
  private static __meleeUnharmed__:MeleeUnharmed;
  private static __rangedUnharmed__:RangedUnharmed;
  private static __noArmor__:ArmorNoArmor;
  private static __noShield__:ShieldNoShield;

  /** * The currently equiped melee weapon. */
  protected _meleeWeapon:MeleeWeapon = null;
  get meleeWeapon():MeleeWeapon { return this._meleeWeapon || CharacterEquipment.__meleeUnharmed__ }
  set meleeWeapon(equipment:MeleeWeapon){this._meleeWeapon=equipment}
  /** * The currently equiped rangedWeapon. */
  protected _rangedWeapon:RangedWeapon = null;
  get rangedWeapon():RangedWeapon { return this._rangedWeapon || CharacterEquipment.__rangedUnharmed__ }
  set rangedWeapon(equipment:RangedWeapon){this._rangedWeapon=equipment}
  /** * *The currently equiped armor. */
  protected _armor:Armor = null;
  get armor():Armor { return this._armor || CharacterEquipment.__noArmor__}
  set armor(equipment:Armor){this._armor=equipment}
  /** * The currently equiped shield. */
  protected _shield:Shield = null;
  get shield():Shield { return this._shield || CharacterEquipment.__noShield__}
  set shield(equipment:Shield){this._shield=equipment}

  constructor(masterService:MasterService)
  {
    this.masterService = masterService;
    this.initializeUnharmed();
  }
  /**
   * Unequip melee weapon and adds it to the inventory.
   *
   * @memberof Character
   */
   unequipMelee(character:Character)
   {
     const melee = this._meleeWeapon;
     if(melee)melee.amount++
     this._meleeWeapon = null;
     character.inventory.addItem(melee);
     melee&&melee.removeModifier(character)
   }
   /**
    * Unequip ranged weapon and adds it to the inventory.
    *
    * @memberof Character
    */
   unequipRanged(character:Character)
   {
     const ranged = this._rangedWeapon;
     if(ranged)ranged.amount++;
     this._rangedWeapon = null;
     character.inventory.addItem(ranged);
     ranged&&ranged.removeModifier(character)
   }
   /**
    * Unequip armor and adds it to the inventory.
    *
    * @memberof Character
    */
   unequipArmor(character:Character)
   {
     const armor = this._armor;
     if(armor)armor.amount++;
     this._armor = null;
     character.inventory.addItem(armor);
     armor&&armor.removeModifier(character)
   }
   /**
    * Unequip shield and adds it to the inventory.
    *
    * @memberof Character
    */
   unequipShield(character:Character)
   {
     const shield = this._shield;
     if(shield)shield.amount++;
     this._shield = null;
     character.inventory.addItem(shield);
     shield&&shield.removeModifier(character)
   }
   /**
   * Initializes the unharmed equpments.
   *
   * @private
   * @memberof Character
   */
  private initializeUnharmed() {
    if(!CharacterEquipment.__meleeUnharmed__)
    {
      CharacterEquipment.__meleeUnharmed__   = new MeleeUnharmed(this.masterService);
      CharacterEquipment.__rangedUnharmed__  = new RangedUnharmed(this.masterService);
      CharacterEquipment.__noArmor__         = new ArmorNoArmor(this.masterService);
      CharacterEquipment.__noShield__        = new ShieldNoShield(this.masterService);
    }
  }
  *[Symbol.iterator]()
  {
    yield this.meleeWeapon;
    yield this.rangedWeapon;
    yield this.armor;
    yield this.shield;
  }
  toJson():CharacterEquipmentOptions
  {
    return {
      Factory: null,
      type: null,
      melee:this._meleeWeapon?this._meleeWeapon.toJson():null,
      ranged:this._rangedWeapon?this._rangedWeapon.toJson():null,
      armor:this._armor?this._armor.toJson():null,
      shield:this._shield?this._shield.toJson():null,
    }
  }
  fromJson(options:CharacterEquipmentOptions)
  {
    options.melee&&(this._meleeWeapon = ItemFactory(this.masterService, options.melee) as MeleeWeapon);
    options.ranged&&(this._rangedWeapon = ItemFactory(this.masterService, options.ranged) as RangedWeapon);
    options.armor&&(this._armor = ItemFactory(this.masterService, options.armor) as Armor);
    options.shield&&(this._shield = ItemFactory(this.masterService, options.shield) as Shield);
  }
}

export type CharacterEquipmentOptions = {
  Factory: null;
  type: null;
  melee:ItemStoreable;
  ranged:ItemStoreable;
  armor:ItemStoreable;
  shield:ItemStoreable;
}
