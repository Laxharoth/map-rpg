import { Storeable } from 'src/gameLogic/core/Factory/Factory';
import { PerkStoreable } from "src/gameLogic/custom/Class/Perk/Perk";
import { StatusStoreable } from "src/gameLogic/custom/Class/Status/Status";
import { PerkFactory } from 'src/gameLogic/custom/Factory/PerkFactory';
import { StatusFactory } from 'src/gameLogic/custom/Factory/StatusFactory';
import { roundToInt } from '../../ClassHelper/Int';
import { tree_node } from '../CharacterBattleClass/ArrayTree';
import { Upgrade } from '../Upgrade/Upgrade';
import { Character, CharacterStoreable } from "./Character";
import { EnergyStats, FullCoreStats, FullResistanceStats, LevelStats } from "./Character.type";
import { CharacterEquipmentOptions } from './Inventory/CharacterEquipment';
import { InventoryOptions } from './Inventory/Inventory';

export abstract class UniqueCharacter extends Character implements Storeable {
  level_up():void{
    const level = ++this.levelStats.level;
    this.levelStats.perkPoint = roundToInt(this.characterBattleClass.levelUpPerkPoint[level]||0);
    this.levelStats.upgradePoint = roundToInt(this.characterBattleClass.levelUpUpgradePoint[level]||0);
  }
  upgrade(currentLevelUpgradeIndex:number):void{
    this.levelStats.upgradePath.push(currentLevelUpgradeIndex);
    // @ts-ignore
    const upgrade = this.characterBattleClass
      .upgradeTree(this.masterService).getNode(this.levelStats.upgradePath).value
    this.levelStats.perkPoint--;
    this.addPerk(upgrade.perk);
  }
  upgradeOptions(path: number[]):tree_node<Upgrade>[]{
    return this.characterBattleClass.upgradeTree(this.masterService).get_children(path);
  }
  emitStatUp():void {
    this.masterService.sceneHandler.headScene({sceneData:()=>this,options:[],fixedOptions:[null,null,null,null,null]},'stat-up')
  }
  emitPerkUp():void {
    this.masterService.sceneHandler.headScene({sceneData:()=>this,options:[],fixedOptions:[null,null,null,null,null]},'perk-tree');
  }
  emitLevelUp():void{ this.emitPerkUp();this.emitStatUp(); }
  total_experience_to_next_level() {
    return this.characterBattleClass.totalExperienceToNextLevel(this.levelStats.level)
  }
  currentLevelExperience() { return this.characterBattleClass.currentLevelExperience(this.levelStats) }
  /** Stores character type, originalstats, status, equipment,items and perks */
  toJson(): UniqueCharacterStoreable {
    const storeables: UniqueCharacterStoreable = {
    ...super.toJson(),
    name: this.name,
    originalStats:this.coreStats,
    originalResistance:this.originalResistance,
    currentCore:this.currentEnergyStats,
    levelStats:this.levelStats,
    gold:this.gold,
    status:[...this.iterStatus()].map(status=>status.toJson()),
    equipment:this.characterEquipment.toJson(),
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
    // tslint:disable: no-string-literal
    if (options['originalStats'])
      this.coreStats = options['originalStats'];
    if (options['levelStats'])
      this.levelStats = {...this.levelStats,...options['levelStats']};
    if (options['originalResistance'])
      this.originalResistance = options['originalResistance'];
    if (options['currentCore'])
      this.currentEnergyStats = options['currentCore'];
    if (options['gold'])
      this.gold = options['gold'];
    if (options['status'])
      for (const status of options['status']) { this.addStatus(StatusFactory(this.masterService, status)); }
    if(options['equipment'])
      this.characterEquipment.fromJson(options['equipment'])
    if (options['inventory'])
      this.inventory.fromJson(options.inventory)
    if (options['perk'])
      for (const perk of options['perk']) { this.addPerk(PerkFactory(this.masterService, perk)); };
    if (options['name'])
      this._name = options.name;
    this.calculateStats();
    this.applyStatus();
  }
}
export interface UniqueCharacterStoreable extends CharacterStoreable{
  originalStats?: FullCoreStats;
  levelStats?: LevelStats;
  originalResistance?: FullResistanceStats;
  currentCore?: EnergyStats;
  gold?: number;
  status?: StatusStoreable[];
  equipment?: CharacterEquipmentOptions;
  inventory?: InventoryOptions;
  perk?:PerkStoreable[];
  name?: string;
  [key: string]: any;
};
