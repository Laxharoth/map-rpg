import { MasterService } from "src/app/service/master.service";
import {  CoreStats, EnergyStats, FullCalculatedStats, FullCoreStats, FullResistanceStats, LevelStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Upgrade } from "../Upgrade/Upgrade";
import { UpgradeOptions } from "../Upgrade/Upgrade.type";
import { UpgradeFactory } from "../Upgrade/UpgradeFactory";
import { ArrayTree, tree_node } from "./ArrayTree";

export abstract class CharacterBattleClass {
  abstract initial_core_stats: EnergyStats;
  abstract initial_physic_stats: FullCoreStats;
  protected abstract _upgrade_tree:ArrayTree<Upgrade>|tree_node<UpgradeOptions>[];
  abstract experience_cap:experience_cap;
  level_up_upgrade_point:experience_cap=[5,5,5,5,5];;
  level_up_perk_point:experience_cap=[1,1,1,1,1];
  initial_resistance_stats: FullResistanceStats = {
    heatresistance: 0,
    energyresistance: 0,
    frostresistance: 0,
    slashresistance: 0,
    bluntresistance: 0,
    pierceresistance: 0,
    poisonresistance: 0,
  };
  max_core_stats:CoreStats[] = [1,2,3,4,5].map(level=>{return {aim:level*10,intelligence:level*10,speed:level*10,stamina:level*10,strenght:level*10}})

  constructor() {}

  upgrade_tree(masterService: MasterService):ArrayTree<Upgrade>
  {
    if(!(this._upgrade_tree instanceof ArrayTree))
    {
      const virtual_root_node:tree_node<Upgrade> = {value:null, children:this.initialize_upgrades(masterService)}
      this._upgrade_tree = new ArrayTree(virtual_root_node)
    }
    return this._upgrade_tree;
  }
  total_experience_to_next_level(level:number):number { return this.experience_cap[level]||0; }
  current_level_experience(level_stats:LevelStats):number { return level_stats.experience - this.total_experience_to_next_level(level_stats.level-1) }
  max_core_at_level(level:number):CoreStats{return this.max_core_stats[level]}
  calculate_stats({
    strenght,
    stamina,
    aim,
    speed,
    intelligence,
  }: FullCoreStats): FullCalculatedStats {
    return {
      physical_attack: 0,
      ranged_attack: 0,
      physical_defence: 0,
      ranged_defence: 0,
      accuracy: 0,
      evasion: 0,
      initiative: 0,
    }
  }
  private initialize_upgrades(masterService: MasterService):tree_node<Upgrade>[]
  {
    if(this._upgrade_tree instanceof ArrayTree)return [this._upgrade_tree.root];
    const fill_root = (root:tree_node<UpgradeOptions>[])=>{
      const upgrade_tree_nodes:tree_node<Upgrade>[] = []
      for(const upgrade_option_node of root)
      {
        upgrade_tree_nodes.push({value:UpgradeFactory(masterService,upgrade_option_node.value),children:fill_root(upgrade_option_node.children)})
      }
      return upgrade_tree_nodes;
    }
    return fill_root(this._upgrade_tree);
  }
}

export type experience_cap = [number, number, number, number, number];
