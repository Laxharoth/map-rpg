import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { PerkStoreable } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";
import { StatusStoreable } from "src/gameLogic/custom/Class/Status/Status";
import { statusname } from "src/gameLogic/custom/Class/Status/Status.type";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";
import { PerkFactory } from 'src/gameLogic/custom/Factory/PerkFactory';
import { StatusFactory } from 'src/gameLogic/custom/Factory/StatusFactory';
import { EnergyStats, CoreStats, ResistanceStats, LevelStats } from "./Character.type";
import { Character } from "./Character";
import { Description } from '../Descriptions/Description';
import { tree_node } from '../CharacterBattleClass/ArrayTree';
import { Upgrade } from '../Upgrade/Upgrade';
import { CharacterEquipmentOptions } from './Inventory/CharacterEquipment';
import { InventoryOptions } from './Inventory/Inventory';


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
    this.addPerk(upgrade.perk);
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
    storeables['equipment'] = this.character_equipment.toJson();
    storeables['inventory'] = this.inventory.toJson()
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
    (options['equipment']) && (this.character_equipment.fromJson(options['equipment']))
    if (options['inventory'])
      this.inventory.fromJson(options.inventory)
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
  equipment?: CharacterEquipmentOptions;
  inventory?: InventoryOptions;
  perk?: { name: perkname; options: PerkStoreable; }[];
  uuid: string;
  name: string;
  [key: string]: any;
};
