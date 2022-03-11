import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { damageTypes } from "src/gameLogic/custom/Class/Battle/DamageSource";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput, CalculatedStats, EnergyStats, FullCalculatedStats, FullCoreStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { ArrayTree, tree_node } from "src/gameLogic/custom/Class/CharacterBattleClass/ArrayTree";
import { experience_cap } from "src/gameLogic/custom/Class/CharacterBattleClass/CharacterBattleClass";
import { Scene } from "src/gameLogic/custom/Class/Scene/Scene";
import { itemname } from "src/gameLogic/custom/Class/Items/Item.type";
import { Upgrade } from "src/gameLogic/custom/Class/Upgrade/Upgrade";
import { UpgradeOptions } from "src/gameLogic/custom/Class/Upgrade/Upgrade.type";

const register:register_function = ({game_item,character_battle_class}, {game_item:{MeleeWeapon,RangedWeapon,Shield,Armor,GameItem},character_battle_class:{CharacterBattleClass} },Factory)=>{
  class ArmorTest extends Armor
  {
    protected _stats_modifier:CalculatedStats = {physical_defence:20,initiative:-5};
    protected _resistance_stats:ResistanceStats = {pierceresistance:10}
    readonly type:"ArmorTest"="ArmorTest"
    get name(): string { return "Armor Test"; }
    canEquip(): boolean { return true; }
  }
  class ItemTest extends GameItem
  {
    readonly type:"item-test"="item-test";
    get name(): itemname { return 'item-test'; }
    get isBattleUsable(): boolean { return false; }
    get isPartyUsable(): boolean { return true; }
    get isEnemyUsable(): boolean { return false; }
    get isSelfUsable(): boolean { return true; }
    get isSingleTarget(): boolean { return false; }
    protected _itemEffect(user:Character,target: Character): ActionOutput
    {
    const healHitPoints = target.healHitPoints(10);
    return [[this.itemEffectScene(target, healHitPoints)],[]];
    }

    //Scene
    private itemEffectScene(target:Character, healHitPoints:number):Scene
    {
      return {
        sceneData: function () {
          return `Heal ${target.name} ${healHitPoints}`
        },
        options: [Factory.options.nextOption(this.masterService)],
        fixed_options: [null, null, null, null, null]
      }
    }
  }
  class MeleeTest extends MeleeWeapon
  {
    protected _stats_modifier:CalculatedStats = {physical_attack:20}
    protected _damageTypes:damageTypes = {bluntdamage:30};
    readonly type:"MeleeTest"="MeleeTest"
    get name(): string { return 'Melee test'; }
    canEquip(character: Character): boolean { return true; }
  }
  class RangedTest extends RangedWeapon
  {
    protected _damageTypes:damageTypes = {piercedamage:20,energydamage:10}
    readonly type:"RangedTest"="RangedTest"
    get name(): string { return 'Ranged Test'; }
    canEquip(character: Character): boolean { return true; }
  }
  class ShieldTest extends Shield
  {
    protected _stats_modifier:CalculatedStats = {physical_defence:20};
    protected _resistance_stats:ResistanceStats = {bluntresistance:10,pierceresistance:5}
    readonly type:"ShieldTest"="ShieldTest"
    get name(): string { return 'Shield test'; }
    canEquip(character: Character): boolean { return true; }
  }
  class TestCharacterBattleClass extends CharacterBattleClass {
    readonly type:"TestCharacterBattleClass"="TestCharacterBattleClass"
    name: string="TestCharacterBattleClass";
    protected _upgrade_tree: ArrayTree<Upgrade> | tree_node<UpgradeOptions>[] = []
    initial_core_stats: EnergyStats = {
      hitpoints: 100,
      energypoints: 100,
    };
    initial_physic_stats: FullCoreStats = {
      strenght: 20,
      stamina: 20,
      aim: 20,
      speed: 20,
      intelligence: 20,
    };
    experience_cap:experience_cap = [ 100,1000,2000,5000,10000 ]
    calculate_stats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): FullCalculatedStats {
      return {
        hitpoints : 100 + Math.round(stamina),
        energypoints : 100 + Math.round(stamina),
        physical_attack: Math.round(strenght + stamina / 2) || 0,
        ranged_attack: Math.round(aim / 2 + strenght / 8 + stamina / 8) || 0,
        physical_defence: Math.round(stamina) || 0,
        ranged_defence: Math.round(aim / 2 + stamina / 2) || 0,
        accuracy: Math.round(aim) || 0,
        evasion: Math.round(speed / 2) || 0,
        initiative: Math.round(speed + intelligence) || 0,
      }
    }
  }
  class TestMainCharacterBattleClass extends CharacterBattleClass
  {
    readonly type:"TestMainCharacterBattleClass"="TestMainCharacterBattleClass"
    readonly name: string="TestMainCharacterBattleClass";
    initial_core_stats: EnergyStats = {
      hitpoints:150,
      energypoints:150,
    };
    initial_physic_stats: FullCoreStats = {
      strenght:25,
      stamina:25,
      aim:25,
      speed:25,
      intelligence:25,
    };
    initial_resistance_stats: ResistanceStats = {
      heatresistance:10,
      energyresistance:10,
      frostresistance:10,
      slashresistance:10,
      bluntresistance:10,
      pierceresistance:10,
      poisonresistance:10,
    };
    experience_cap:experience_cap = [ 100,1000,2000,5000,10000 ]
    calculate_stats({strenght, stamina, aim, speed, intelligence,}:FullCoreStats):FullCalculatedStats {
      return {
        hitpoints : 100 + Math.round(stamina),
        energypoints : 100 + Math.round(stamina),
        physical_attack:Math.round(strenght+stamina/2)+10||0,
        ranged_attack:Math.round(aim/2+strenght/8+stamina/8)+10||0,
        physical_defence:Math.round(stamina)+10||0,
        ranged_defence:Math.round(aim/2+stamina/2)+10||0,
        accuracy:Math.round(aim)+10||0,
        evasion:Math.round(speed/2)+10||0,
        initiative:Math.round(speed+intelligence)+10||0,
      }
    }
    protected _upgrade_tree: ArrayTree<Upgrade> | tree_node<UpgradeOptions>[] = [
      {value:{Factory:'Upgrade',type:'Charm'}      ,children:[
        {value:{Factory:'Upgrade',type:'Fright'},children:[
          {value:{Factory:'Upgrade',type:'Grappler'},children:[]},
          {value:{Factory:'Upgrade',type:'Poison Rush'},children:[]},
        ]},
        {value:{Factory:'Upgrade',type:'Grappler'},children:[
          {value:{Factory:'Upgrade',type:'Fright'},children:[]},
          {value:{Factory:'Upgrade',type:'Poison Rush'},children:[]},
        ]},
        {value:{Factory:'Upgrade',type:'Poison Rush'},children:[
          {value:{Factory:'Upgrade',type:'Fright'},children:[]},
          {value:{Factory:'Upgrade',type:'Grappler'},children:[]},
        ]},
      ]},
      {value:{Factory:'Upgrade',type:'Fright'}     ,children:[
        {value:{Factory:'Upgrade',type:'Charm'},children:[
          {value:{Factory:'Upgrade',type:'Grappler'},children:[]},
          {value:{Factory:'Upgrade',type:'Poison Rush'},children:[]},
        ]},
        {value:{Factory:'Upgrade',type:'Grappler'},children:[
          {value:{Factory:'Upgrade',type:'Charm'},children:[]},
          {value:{Factory:'Upgrade',type:'Poison Rush'},children:[]},
        ]},
        {value:{Factory:'Upgrade',type:'Poison Rush'},children:[
          {value:{Factory:'Upgrade',type:'Charm'},children:[]},
          {value:{Factory:'Upgrade',type:'Grappler'},children:[]},
        ]},
      ]},
      {value:{Factory:'Upgrade',type:'Grappler'}   ,children:[
        {value:{Factory:'Upgrade',type:'Fright'},children:[
          {value:{Factory:'Upgrade',type:'Charm'},children:[]},
          {value:{Factory:'Upgrade',type:'Poison Rush'},children:[]},
        ]},
        {value:{Factory:'Upgrade',type:'Charm'},children:[
          {value:{Factory:'Upgrade',type:'Fright'},children:[]},
          {value:{Factory:'Upgrade',type:'Poison Rush'},children:[]},
        ]},
        {value:{Factory:'Upgrade',type:'Poison Rush'},children:[
          {value:{Factory:'Upgrade',type:'Fright'},children:[]},
          {value:{Factory:'Upgrade',type:'Charm'},children:[]},
        ]},
      ]},
      {value:{Factory:'Upgrade',type:'Poison Rush'},children:[
        {value:{Factory:'Upgrade',type:'Fright'},children:[
          {value:{Factory:'Upgrade',type:'Grappler'},children:[]},
          {value:{Factory:'Upgrade',type:'Charm'},children:[]},
        ]},
        {value:{Factory:'Upgrade',type:'Grappler'},children:[
          {value:{Factory:'Upgrade',type:'Fright'},children:[]},
          {value:{Factory:'Upgrade',type:'Charm'},children:[]},
        ]},
        {value:{Factory:'Upgrade',type:'Charm'},children:[
          {value:{Factory:'Upgrade',type:'Fright'},children:[]},
          {value:{Factory:'Upgrade',type:'Grappler'},children:[]},
        ]},
      ]},
    ]
  }
  game_item["ShieldTest"]=ShieldTest
  game_item["RangedTest"]=RangedTest
  game_item["MeleeTest"]=MeleeTest
  game_item["item-test"]=ItemTest
  game_item["ArmorTest"] = ArmorTest
  character_battle_class["TestCharacterBattleClass"]=TestCharacterBattleClass
  character_battle_class["TestMainCharacterBattleClass"]=TestMainCharacterBattleClass
}
const module_name="EquipmentTest";
const module_dependency=[]

export {register, module_name, module_dependency}
