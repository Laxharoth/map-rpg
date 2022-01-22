import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { damageTypes } from "src/gameLogic/custom/Class/Battle/DamageSource";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput, CalculatedStats, ResistanceStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Description } from "src/gameLogic/custom/Class/Descriptions/Description";
import { armorname, itemname, meleename, rangedname, shieldname } from "src/gameLogic/custom/Class/Items/Item.type";

const register:register_function = ({game_item}, {game_item:{MeleeWeapon,RangedWeapon,Shield,Armor,GameItem} },Factory)=>{
  class ArmorTest extends Armor
  {
    protected _stats_modifier:CalculatedStats = {physical_defence:20,initiative:-5};
    protected _resistance_stats:ResistanceStats = {pierceresistance:10}
    get name(): armorname { return "Armor Test"; }
    canEquip(): boolean { return true; }
  }
  class ItemTest extends GameItem
  {
    get name(): itemname { return 'item-test'; }
    get isBattleUsable(): boolean { return false; }
    get isPartyUsable(): boolean { return true; }
    get isEnemyUsable(): boolean { return false; }
    get isSelfUsable(): boolean { return true; }
    get isSingleTarget(): boolean { return false; }
    protected _itemEffect(user:Character,target: Character): ActionOutput
    {
    const healHitPoints = target.healHitPoints(10);
    return [[this.itemEffectDescription(target, healHitPoints)],[]];
    }

    //Description
    private itemEffectDescription(target:Character, healHitPoints:number):Description
    {
      return {
        descriptionData: function () {
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
    get name(): meleename { return 'Melee test'; }
    canEquip(character: Character): boolean { return true; }
  }
  class RangedTest extends RangedWeapon
  {
    protected _damageTypes:damageTypes = {piercedamage:20,energydamage:10}
    get name(): rangedname { return 'Ranged Test'; }
    canEquip(character: Character): boolean { return true; }
  }
  class ShieldTest extends Shield
  {
    protected _stats_modifier:CalculatedStats = {physical_defence:20};
    protected _resistance_stats:ResistanceStats = {bluntresistance:10,pierceresistance:5}
    get name(): shieldname { return 'Shield test'; }
    canEquip(character: Character): boolean { return true; }
  }
  game_item["Shield test"]=ShieldTest
  game_item["Ranged Test"]=RangedTest
  game_item["Melee test"]=MeleeTest
  game_item["item-test"]=ItemTest
  game_item["Armor Test"] = ArmorTest
}
const module_name="EquipmentTest";
const module_dependency=[]

export {register, module_name, module_dependency}
