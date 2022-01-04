import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { Armor } from "src/gameLogic/custom/Class/Equipment/Armor/Armor";
import { Shield } from "src/gameLogic/custom/Class/Equipment/Shield/Shield";
import { MeleeWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Melee/MeleeWeapon";
import { RangedWeapon } from "src/gameLogic/custom/Class/Equipment/Weapon/Ranged/RangedWeapon";
import { ItemStoreable } from 'src/gameLogic/custom/Class/Items/Item';
import { itemname } from 'src/gameLogic/custom/Class/Items/Item.type';
import { PerkStoreable } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";
import { StatusStoreable } from "src/gameLogic/custom/Class/Status/Status";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { PerkFactory } from 'src/gameLogic/custom/Factory/PerkFactory';
import { StatusFactory } from 'src/gameLogic/custom/Factory/StatusFactory';
import { EnergyStats, CoreStats, ResistanceStats, LevelStats } from "./Character.type";
import { Character } from "./Character";
import { Description } from '../Descriptions/Description';
import { tree_node } from '../CharacterBattleClass/ArrayTree';
import { Upgrade } from '../Upgrade/Upgrade';


export abstract class UniqueCharacter extends Character implements storeable {
  uuid: string;
  level_up():void
  {
    const level = ++this.level_stats.level;
    this.level_stats.perk_point = this.character_battle_class.level_up_perk_point[level]||0;
    this.level_stats.upgrade_point = this.character_battle_class.level_up_upgrade_point[level]||0;
  }
  upgrade(current_level_upgrade_index:number):void
  {
    this.level_stats.upgrade_path.push(current_level_upgrade_index);
    const upgrade = this.character_battle_class.upgrade_tree(this.masterService).get_node(this.level_stats.upgrade_path).value
    this.level_stats.perk_point--;
    this.addPerk(upgrade.upgrade);
  }
  upgrade_options(path: number[]):tree_node<Upgrade>[]
  {
    return this.character_battle_class.upgrade_tree(this.masterService).get_children(path);
  }
  emit_stat_up():void { this.masterService.descriptionHandler.headDescription(new Description(()=>this,[]),'stat-up') }
  emit_perk_up():void { this.masterService.descriptionHandler.headDescription(new Description(()=>this,[]),'perk-tree');}
  emit_level_up():void{ this.emit_perk_up();this.emit_stat_up(); }
  total_experience_to_next_level() { return this.character_battle_class.total_experience_to_next_level(this.level_stats.level) }
  current_level_experience() { return this.character_battle_class.current_level_experience(this.level_stats) }
  /**
   * Stores character type, originalstats, status, equipment,items and perks
   *
   * @return {*}  {{[key: string]:any}}
   * @memberof Character
   */
  toJson(): CharacterStoreable {
    const storeables: CharacterStoreable = { Factory: "Character", type: this.characterType, uuid: this.uuid, name: this.name };
    storeables['originalCore'] = this.energy_stats;
    storeables['originalStats'] = this.core_stats;
    storeables['originalResistance'] = this.original_resistance;
    storeables['currentCore'] = this.current_energy_stats;
    storeables['levelStats'] = this.level_stats;
    storeables['gold'] = this.gold;
    storeables['status'] = [];
    for (const status of this.iterStatus())
      storeables['status'].push({ name: status.name, options: status.toJson() });
    if (this._meleeWeapon)
      storeables['melee'] = { name: this._meleeWeapon.name, options: this._meleeWeapon.toJson() };
    if (this._rangedWeapon)
      storeables['ranged'] = { name: this._rangedWeapon.name, options: this._rangedWeapon.toJson() };
    if (this._armor)
      storeables['armor'] = { name: this._armor.name, options: this._armor.toJson() };
    if (this._shield)
      storeables['shield'] = { name: this._shield.name, options: this._shield.toJson() };
    storeables['inventory'] = [];
    for (const item of this.inventory)
      storeables['inventory'].push({ name: item.name, options: item.toJson() });
    storeables['perk'] = [];
    for (const perk of this.perks)
      storeables['perk'].push({ name: perk.name, options: perk.toJson() });
    return storeables;
  }
  /**
   * loads originalstats, status, equipment,items and perks
   *
   * @param {{[key: string]: any}} options
   * @memberof Character
   */
  fromJson(options: CharacterStoreable): void {
    if (options['originalCore'])
      this.energy_stats = options['originalCore'];
    if (options['originalStats'])
      this.core_stats = options['originalStats'];
    if (options['levelStats'])
      this.level_stats = {...this.level_stats,...options['levelStats']};
    if (options['originalResistance'])
      this.original_resistance = options['originalResistance'];
    if (options['currentCore'])
      this.current_energy_stats = options['currentCore'];
    if (options['gold'])
      this.gold = options['gold'];
    if (options['status'])
      for (const status of options['status']) { this.addStatus(StatusFactory(this.masterService, status.options)); }
    (options['melee']) && (this._meleeWeapon = ItemFactory(this.masterService, options['melee'].options) as MeleeWeapon);
    (options['ranged']) && (this._rangedWeapon = ItemFactory(this.masterService, options['ranged'].options) as RangedWeapon);
    (options['armor']) && (this._armor = ItemFactory(this.masterService, options['armor'].options) as Armor);
    (options['shield']) && (this._shield = ItemFactory(this.masterService, options['shield'].options) as Shield);
    if (options['inventory'])
      for (const item of options['inventory']) { this.addItem(ItemFactory(this.masterService, item.options)); };
    if (options['perk'])
      for (const perk of options['perk']) { this.addPerk(PerkFactory(this.masterService, perk.options)); };
    this._name = options.name;
    this.calculateStats();
    this.applyStatus();
  }
}
export type CharacterStoreable = {
  Factory: "Character";
  type: characterType;
  originalCore?: EnergyStats;
  originalStats?: CoreStats;
  levelStats?: LevelStats;
  originalResistance?: ResistanceStats;
  currentCore?: EnergyStats;
  gold?: number;
  status?: { name: statusname; options: StatusStoreable; }[];
  melee?: { name: itemname; options: ItemStoreable; };
  ranged?: { name: itemname; options: ItemStoreable; };
  armor?: { name: itemname; options: ItemStoreable; };
  shield?: { name: itemname; options: ItemStoreable; };
  inventory?: { name: itemname; options: ItemStoreable; }[];
  perk?: { name: perkname; options: PerkStoreable; }[];
  uuid: string;
  name: string;
  [key: string]: any;
};
