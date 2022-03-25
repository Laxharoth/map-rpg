import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { PerkStoreable } from "src/gameLogic/custom/Class/Perk/Perk";
import { StatusStoreable } from "src/gameLogic/custom/Class/Status/Status";
import { PerkFactory } from 'src/gameLogic/custom/Factory/PerkFactory';
import { StatusFactory } from 'src/gameLogic/custom/Factory/StatusFactory';
import { EnergyStats, LevelStats, FullCoreStats, FullResistanceStats } from "./Character.type";
import { Character, CharacterStoreable } from "./Character";
import { tree_node } from '../CharacterBattleClass/ArrayTree';
import { Upgrade } from '../Upgrade/Upgrade';
import { CharacterEquipmentOptions } from './Inventory/CharacterEquipment';
import { InventoryOptions } from './Inventory/Inventory';

export abstract class UniqueCharacter extends Character implements storeable {
  level_up():void{
    const level = ++this.level_stats.level;
    this.level_stats.perk_point = this.character_battle_class.level_up_perk_point[level]||0;
    this.level_stats.upgrade_point = this.character_battle_class.level_up_upgrade_point[level]||0;
  }
  upgrade(current_level_upgrade_index:number):void{
    this.level_stats.upgrade_path.push(current_level_upgrade_index);
    // @ts-ignore
    const upgrade = this.character_battle_class.upgrade_tree(this.masterService).get_node(this.level_stats.upgrade_path).value
    this.level_stats.perk_point--;
    this.addPerk(upgrade.perk);
  }
  upgrade_options(path: number[]):tree_node<Upgrade>[]{
    return this.character_battle_class.upgrade_tree(this.masterService).get_children(path);
  }
  emit_stat_up():void { this.masterService.sceneHandler.headScene({sceneData:()=>this,options:[],fixed_options:[null,null,null,null,null]},'stat-up') }
  emit_perk_up():void { this.masterService.sceneHandler.headScene({sceneData:()=>this,options:[],fixed_options:[null,null,null,null,null]},'perk-tree');}
  emit_level_up():void{ this.emit_perk_up();this.emit_stat_up(); }
  total_experience_to_next_level() { return this.character_battle_class.total_experience_to_next_level(this.level_stats.level) }
  current_level_experience() { return this.character_battle_class.current_level_experience(this.level_stats) }
  /** Stores character type, originalstats, status, equipment,items and perks */
  toJson(): UniqueCharacterStoreable {
    const storeables: UniqueCharacterStoreable = {
    ...super.toJson(),
    name: this.name,
    originalStats:this.core_stats,
    originalResistance:this.original_resistance,
    currentCore:this.current_energy_stats,
    levelStats:this.level_stats,
    gold:this.gold,
    status:[...this.iterStatus()].map(status=>status.toJson()),
    equipment:this.character_equipment.toJson(),
    inventory:this.inventory.toJson(),
    perk:this.perks.map(perk=>perk.toJson()),
  };
    return storeables;
  }
  /**
   * loads originalstats, status, equipment,items and perks
   */
  fromJson(options: UniqueCharacterStoreable): void {
    super.fromJson(options)
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
      for (const status of options['status']) { this.addStatus(StatusFactory(this.masterService, status)); }
    (options['equipment']) && (this.character_equipment.fromJson(options['equipment']))
    if (options['inventory'])
      this.inventory.fromJson(options.inventory)
    if (options['perk'])
      for (const perk of options['perk']) { this.addPerk(PerkFactory(this.masterService, perk)); };
    this._name = options.name;
    this.calculateStats();
    this.applyStatus();
  }
}
export interface UniqueCharacterStoreable extends CharacterStoreable{
  originalStats: FullCoreStats;
  levelStats: LevelStats;
  originalResistance: FullResistanceStats;
  currentCore: EnergyStats;
  gold: number;
  status: StatusStoreable[];
  equipment: CharacterEquipmentOptions;
  inventory: InventoryOptions;
  perk?:PerkStoreable[];
  name?: string;
  [key: string]: any;
};
