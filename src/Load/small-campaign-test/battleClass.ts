import { DescriptableSceneOptions } from './../../gameLogic/custom/Class/Scene/Scene';
import { PerkFactory } from 'src/gameLogic/custom/Factory/PerkFactory';
import { MasterService } from "src/app/service/master.service";
import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { BattleCommand, SelectCommandTargetStrategy, SelectSingleTargetStrategy, SelectTargetStrategy, SingleTargetCommand } from "src/gameLogic/custom/Class/Battle/BattleCommand";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { CalculatedStats, CoreStats, FullCoreStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { Enemy } from "src/gameLogic/custom/Class/Character/Enemy/Enemy";
import { ArrayTree, tree_node } from "src/gameLogic/custom/Class/CharacterBattleClass/ArrayTree";
import { experience_cap } from "src/gameLogic/custom/Class/CharacterBattleClass/CharacterBattleClass";
import { ItemStoreable } from "src/gameLogic/custom/Class/Items/Item";
import { Upgrade } from "src/gameLogic/custom/Class/Upgrade/Upgrade";
import { UpgradeOptions } from "src/gameLogic/custom/Class/Upgrade/Upgrade.type";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory";
import { Scene } from 'src/gameLogic/custom/Class/Scene/Scene';
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { UniqueCharacterStoreable } from 'src/gameLogic/custom/Class/Character/UniqueCharacter';
import { primitive } from 'src/gameLogic/core/types';
import { BattleUseable } from 'src/gameLogic/custom/Class/Items/BattleUseable';

const register:register_function = ({enemy_formation,character_battle_class,character}, {enemy_formation:{EnemyFormation},character_battle_class:{CharacterBattleClass}, character:{Character,PersistentCharacter,UniqueCharacter}}, Factory)=>{
  const perkFactory = Factory as typeof PerkFactory;
  const possibleTargets = (user:Character,userally: Character[], enemy: Character[],battleUseable:BattleUseable)=>[
      ...battleUseable.isSelfUsable?[user]:[],
      ...battleUseable.isPartyUsable?userally:[],
      ...battleUseable.isEnemyUsable?enemy:[],
    ]
  const randomAnyTarget = function(targets: Character[]){
    const target  = targets[Math.floor(Math.random() * targets.length)];
    return [target];
  }
  const selectSingleEnemyMaxHP:SelectSingleTargetStrategy = function(user,userally: Character[], enemy: Character[]){
    const maxHP = Math.max(...enemy.map( enemy => enemy.current_energy_stats.hitpoints ));
    return [enemy.find( enemy => enemy.current_energy_stats.hitpoints === maxHP ) || enemy[0]];
  }
  const AttackOrDefend:SelectCommandTargetStrategy = (user,ally,enemy,targetStrategy)=>{
    if(Factory.randomCheck(95)){
      return user.Attack(targetStrategy(user,ally,enemy));
    }
    return user.Defend([user]);
  }
  abstract class EnemyBaseClass extends CharacterBattleClass{
    protected _initial_physic_stats: CoreStats = {
      strenght:1,
      aim:1,
      intelligence:1,
      speed:1,
      stamina:1,
    };
    protected _upgrade_tree: ArrayTree<Upgrade> | tree_node<UpgradeOptions>[] = [];
    experience_cap: experience_cap = [0,0,0,0,0];
  }
  class Bandit extends EnemyBaseClass{
    type: string = "Bandit";
    name: string = "Bandit";
    protected _calculate_stats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:11*stamina,
        energypoints:0,
        physical_attack:1.1*strenght,
        ranged_attack:1.2*aim,
        physical_defence:1.2*stamina,
        ranged_defence:1.2*speed,
        accuracy:1.2*(intelligence+speed)/2,
        evasion:1.2*(intelligence+speed)/2,
        initiative:30*speed,
      }
    }
  }
  class Guard extends EnemyBaseClass{
    type: string = "Guard";
    name: string = "Guard";
    protected _calculate_stats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:11*stamina,
        energypoints:0,
        physical_attack:1.3*strenght,
        ranged_attack:1*aim,
        physical_defence:1.6*stamina,
        ranged_defence:1.7*speed,
        accuracy:1.2*(intelligence+speed)/2,
        evasion:1.2*(intelligence+speed)/2,
        initiative:25*speed,
      }
    }
  }
  class Spy extends EnemyBaseClass{
    type: string = "Spy";
    name: string = "Spy";
    protected _calculate_stats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:27,
        energypoints:20,
        physical_attack:1.0*strenght,
        ranged_attack:1.5*aim*speed*intelligence/3,
        physical_defence:1.2*stamina,
        ranged_defence:1.2*speed,
        accuracy:1.5*aim*intelligence/2,
        evasion:1.5*aim*intelligence/2,
        initiative:30*speed*intelligence/2,
      }
    }
  }
  class Thug extends EnemyBaseClass{
    type: string = "Thug ";
    name: string = "Thug ";
    protected _initial_physic_stats: CoreStats = { ...super.initial_physic_stats, stamina:2 };
    protected _calculate_stats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:16*stamina,
        energypoints:16*stamina,
        physical_attack:15*strenght,
        ranged_attack:15*speed,
        physical_defence:6*stamina,
        ranged_defence:6*stamina,
        accuracy:11*aim,
        evasion:11*aim,
        initiative:30*speed,
      }
    }
  }
  abstract class BaseEnemy extends Character implements Enemy{
    abstract enemy_type: string;
    base_experience: number = 25;
    get loot(): ItemStoreable[] {
      return [];
    }
    protected _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
      return this.Attack(ally);
    }
  }
  class BanditEnemy extends BaseEnemy{
    protected _name: string = "Bandit";
    type: characterType="Bandit";
    enemy_type: string = "Bandit";
    constructor(masterService:MasterService){
      super(masterService,"Bandit");
    }
    protected _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
      const net = this.inventory.find("Net");
      if(net){
        return this.useItem(net,selectSingleEnemyMaxHP(this,ally,enemy));
      }
      return AttackOrDefend(this,ally,enemy,selectSingleEnemyMaxHP)
    }
  }
  class GuardEnemy extends BaseEnemy{
    enemy_type: string="Guard";
    protected _name: string="Guard";
    type: characterType="Guard";
    constructor(masterService:MasterService){
      super(masterService,"Guard");
      this.addPerk(perkFactory(this.masterService,{Factory:"Perk",type:"BlindInmune"}));
    }
    protected _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
      return AttackOrDefend(this,ally,enemy,selectSingleEnemyMaxHP)
    }
  }
  class Seller extends PersistentCharacter implements Enemy{
    enemy_type: string="Spy";
    protected _name: string="Dragon Egg Seller";
    warryScore = 70;
    distractionScore = 0;
    type: characterType="DragonSeller";
    constructor(masterService:MasterService){
      super(masterService,"Spy");
      this.addPerk(perkFactory(this.masterService,{Factory:"Perk",type:"BlindInmune"}));
      this.addPerk(perkFactory(this.masterService,{Factory:"Perk",type:"SneakAttack"}));
      this.addPerk(perkFactory(this.masterService,{Factory:"Perk",type:"MultiAttack"}));
    }
    get loot(): ItemStoreable[] { return []; }
    base_experience: number = 10;
    protected _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
      const sneakAttack = this.specialAttacks.get("SneakAttack");
      const multyAttack = this.specialAttacks.get("MultiAttack");
      if(sneakAttack && !sneakAttack.disabled(this) && Factory.randomCheck(5)){
        return this.useItem(sneakAttack,possibleTargets(this,ally,enemy,sneakAttack));
      }
      if(multyAttack && !multyAttack.disabled(this) && Factory.randomCheck(5)){
        return this.useItem(multyAttack,selectSingleEnemyMaxHP(this,ally,enemy));
      }
      return AttackOrDefend(this,ally,enemy,selectSingleEnemyMaxHP)
    }
  }
  class ThugEnemy extends BaseEnemy{
    protected _name: string = "Thug";
    type: characterType="Thug";
    enemy_type: string = "Thug";
    constructor(masterService:MasterService){
      super(masterService,"Thug");
      this.addPerk(perkFactory(this.masterService,{Factory:"Perk",type:"PackTactics"}))
      this.addPerk(perkFactory(this.masterService,{Factory:"Perk",type:"MultiAttack"}))
    }
    protected _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
      const multyAttack = this.specialAttacks.get("MultiAttack");
      if(multyAttack && !multyAttack.disabled(this) && Factory.randomCheck(5)){
        return this.useItem(multyAttack,selectSingleEnemyMaxHP(this,ally,enemy));
      }
      return AttackOrDefend(this,ally,enemy,selectSingleEnemyMaxHP)
    }
  }
  class SellerCrew extends EnemyFormation{
    type="SellerCrew";
    protected _enemies: (Character & Enemy)[];
    constructor(masterService:MasterService){
      super(masterService);
      this._enemies = [
        masterService.UniqueCharacterHandler.get_character("DragonSeller") as unknown as (Character & Enemy),
        new GuardEnemy(masterService),
        new GuardEnemy(masterService),
      ];
    }
    onEnemyVictory(party: Character[]): Scene {
      return {
        sceneData(){return "The seller open a secret door and escapes."},
        options:[
          Factory.options.nextOption(this.masterService)
        ]
      };
    }
    onPartyVictory(party: Character[]): Scene {
      return {
        sceneData(){return "The seller open a secret door and escapes."},
        options:[
          Factory.options.nextOption(this.masterService)
        ]
      };
    }
    protected escapeSuccess(): string {
      this.masterService.partyHandler.user.inventory.addItem(
        (Factory as typeof ItemFactory)(this.masterService,{Factory:"Item",type:"FakeDragonEgg"})
      );
      return "When escaping the seller also escaped dropping other egg";
    }
    protected escapeFail(): string {
      throw new Error('Method not implemented.');
    }
    protected escapeCheck(party: Character[]): boolean {
      return true;
    }
  }
  class ThugCrew extends EnemyFormation{
    type: primitive = "ThugCrew";
    private boss = new ThugEnemy(this.masterService);
    private bandits = [
      new BanditEnemy(this.masterService),
      new BanditEnemy(this.masterService),
      new BanditEnemy(this.masterService),
      new BanditEnemy(this.masterService),
    ]
    constructor(masterService:MasterService){
      super(masterService);
      let i = 1;
      for(const enemy of this.bandits){
        // @ts-ignore
        enemy._name = `Bandit${i++}`;
      }
    }
    protected get _enemies(): (Character & Enemy)[]{
      return [
        this.boss,
        ...this.bandits.sort( (bandit1,bandit2)=>Number(bandit1.is_defeated() && !bandit2.is_defeated())).slice(2)
      ];
    }
    get IsDefeated(): boolean {
      return this.boss.is_defeated();
    }
    onEnemyVictory(party: Character[]): Scene {
      return {
        sceneData:()=>{
          const egg = this.masterService.partyHandler.user.inventory.find("FakeDragonEgg");
          if(egg){
            this.masterService.partyHandler.user.inventory.dropItem(egg);
            return "the bandits take the egg and run away";
          }
          return "the bandits run away";
        },
        options:[Factory.options.nextOption(this.masterService,"next")]
      };
    }
    onPartyVictory(party: Character[]): Scene {
      return {
        sceneData(){ return "Defeated Thug" },
        options:[ Factory.options.nextOption(this.masterService) ]
      };
    }
    protected escapeSuccess(): string {
      if(this.boss.inventory.has("FakeDragonEgg")){
        return "The Thug has the Egg and leaves";
      }
      return "Escaped";
    }
    protected escapeFail(): string {
      return "Can't escape";
    }
    protected escapeCheck(party: Character[]): boolean {
      return this.boss.inventory.has("FakeDragonEgg");
    }
    private giveUpEgg():void{
      const masterService = this.masterService;
      masterService.flagsHandler.setFlag("thug-revenge",true);
      const egg = masterService.partyHandler.user.inventory.find("FakeDragonEgg");
      if(!egg){ return; }
      masterService.partyHandler.user.inventory.dropItem(egg);
      this.boss.inventory.addItem(egg);
    }
    preventBattleByGiveUpEgg():DescriptableSceneOptions{
      const masterService = this.masterService;
      return {
        text:"Give egg",
        action:()=>{
          this.giveUpEgg();
          masterService.sceneHandler.clear("talk")
            .headScene({
              sceneData(){return "Thug:Good choice kid."},
              options:[ Factory.options.nextOption(this.masterService)]
            },"talk")
            .setScene();
        },
        get disabled():boolean{
          return !masterService.partyHandler.user.inventory.has("FakeDragonEgg");
        },
        descriptable:{
          description:[
            {type:"description",section_items:[{name:"description",value:"Give the egg to the bandits"}]}
          ]
        }
      }
    }
    escapeByGiveUpEgg():DescriptableSceneOptions{
      const masterService = this.masterService;
      return {
        text:"Give egg",
        action:()=>{
          this.giveUpEgg();
          Factory.escapeBattle(masterService);
        },
        get disabled():boolean{
          return !masterService.partyHandler.user.inventory.has("FakeDragonEgg");
        },
        descriptable:{
          description:[
            {type:"description",section_items:[{name:"description",value:"Give the egg to the bandits"}]}
          ]
        }
      }
    }
  }
  class Bandits extends EnemyFormation{
    type: string = "Bandits"
    constructor(masterService:MasterService){
      super(masterService);
      let i = 1;
      for(const enemy of this._enemies){
        // @ts-ignore
        enemy._name = `Bandit${i++}`;
      }
    }
    protected _enemies: (Character & Enemy)[] = [ new BanditEnemy(this.masterService), new BanditEnemy(this.masterService), ]
    onEnemyVictory(party: Character[]): Scene {
      return {
        sceneData:()=>{
          const egg = this.masterService.partyHandler.user.inventory.find("FakeDragonEgg");
          if(egg){
            this.masterService.partyHandler.user.inventory.dropItem(egg);
            return "the bandits take the egg and run away";
          }
          return "the bandits leave";
        },
        options:[Factory.options.nextOption(this.masterService,"next")]
      };
    }
    onPartyVictory(party: Character[]): Scene {
      return {
        sceneData(){ return "Defeated Thug" },
        options:[ Factory.options.nextOption(this.masterService) ]
      };
    }
    protected escapeSuccess(): string {
      return "Escaped Success"
    }
    protected escapeFail(): string {
      return "Can't escape";
    }
    protected escapeCheck(party: Character[]): boolean {
      return Factory.randomCheck(30);
    }
  }
  abstract class BaseUserClass extends CharacterBattleClass{
    protected _initial_physic_stats: CoreStats = {
      strenght:1,
      aim:1,
      intelligence:1,
      speed:1,
      stamina:1,
    };
    protected _upgrade_tree: ArrayTree<Upgrade> | tree_node<UpgradeOptions>[] = [];
    experience_cap: experience_cap = [0,0,0,0,0];
  }
  class Fighter extends BaseUserClass{
    type: string = "Fighter";
    name: string = "Fighter";
    protected _calculate_stats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:6*stamina,
        energypoints:3*stamina,
        physical_attack:7*strenght,
        ranged_attack:4*speed,
        physical_defence:6*stamina,
        ranged_defence:6*stamina,
        accuracy:5*aim,
        evasion:5*aim,
        initiative:10*speed,
      }
    }
  }
  class Monk extends BaseUserClass{
    type: string = "Monk";
    name: string = "Monk";
    protected _calculate_stats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:7*stamina,
        energypoints:3*stamina,
        physical_attack:3*(strenght+speed),
        ranged_attack:2*speed,
        physical_defence:Math.round(5*(stamina+speed)/3),
        ranged_defence:Math.round(5*(stamina+speed)/3),
        accuracy:5*(aim+speed),
        evasion:5*(aim+speed),
        initiative:13*(speed+intelligence),
      }
    }
  }
  class Cleric extends BaseUserClass{
    type: string = "Monk";
    name: string = "Monk";
    protected _calculate_stats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:6*stamina,
        energypoints:5*intelligence,
        physical_attack:Math.round(3*(strenght+intelligence/2)),
        ranged_attack:2*speed,
        physical_defence:Math.round(5*(stamina+speed)/3),
        ranged_defence:Math.round(5*(stamina+speed)/3),
        accuracy:5*(aim+intelligence),
        evasion:5*(aim+intelligence),
        initiative:10*speed,
      }
    }
  }
  abstract class UsableCharacter extends UniqueCharacter{
    private registerKey!:""
    toJson():UniqueCharacterStoreable{
      const options = super.toJson();
      options["register-key"] = this.registerKey;
      return options;
    }
    fromJson(options: UniqueCharacterStoreable): void {
      super.fromJson(options);
      if(options["register-key"]){
        this.masterService.gameSaver.register(options["register-key"],this);
        this.registerKey = options["register-key"];
      }
    }
    protected _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
      return AttackOrDefend(this,ally,enemy,selectSingleEnemyMaxHP);
    }
  }
  class FrankiePeanuts extends UsableCharacter{
    protected _name: string = "Frankie Peanuts";
    type: characterType = "FrankiePeanuts";
    constructor(master:MasterService){
      super(master,"Cleric");
      this.addPerk(perkFactory(this.masterService,{Factory:"Perk",type:"Guidance"}))
      this.addPerk(perkFactory(this.masterService,{Factory:"Perk",type:"Mending"}))
      this.addPerk(perkFactory(this.masterService,{Factory:"Perk",type:"SacredFlame"}))
    }
    protected _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
      const guidance = this.specialAttacks.get("Guidance");
      const mending = this.specialAttacks.get("Mending");
      const sacredFlame = this.specialAttacks.get("SacredFlame");
      if(guidance && !guidance.disabled(this)){
        const targets = possibleTargets(this,ally,enemy, guidance);
        this.useItem(guidance,randomAnyTarget(targets));
      }
      const hurtedAlly = ally.find( ally => ally.current_energy_stats.hitpoints / ally.calculated_stats.hitpoints < 0.25 );
      if(mending && !mending.disabled(this) && hurtedAlly ){
        this.useItem(mending,[hurtedAlly]);
      }
      if(sacredFlame && !sacredFlame.disabled(this) && Factory.randomCheck(29)){
        this.useItem(sacredFlame,selectSingleEnemyMaxHP(this,ally,enemy));
      }
      return AttackOrDefend(this,ally,enemy,selectSingleEnemyMaxHP)
    }
  }
  class BishopVault extends UsableCharacter{
    protected _name: string = "Bishop Vault";
    type: characterType = "BishopVault";
    constructor(master:MasterService){
      super(master,"Fighter");
    }
  }
  class Timber extends UsableCharacter{
    protected _name: string = "Timber";
    type: characterType = "Timber";
    constructor(master:MasterService){
      super(master,"Fighter");
    }
  }
  //enemy
  character_battle_class["Bandit"]=Bandit;
  character_battle_class["Guard"]=Guard;
  character_battle_class["Spy"]=Spy;
  character_battle_class["Thug"]=Thug;
  character["Bandit"] = BanditEnemy;
  character["Guard"] = GuardEnemy;
  character["DragonSeller"] = Seller;
  character["Thug"] = ThugEnemy;
  enemy_formation["SellerCrew"]=SellerCrew;
  enemy_formation["ThugCrew"]=ThugCrew;
  enemy_formation["Bandits"]=Bandits;
  //player
  character_battle_class["Cleric"]=Cleric;
  character_battle_class["Monk"]=Monk;
  character_battle_class["Fighter"]=Fighter;
  character["FrankiePeanuts"] = FrankiePeanuts;
  character["BishopVault"] = BishopVault;
  character["Timber"] = Timber;
}
const module_name = "small-campaign-battle-class";
const module_dependency:string[] = ["small-campaign-reaction","small-campaign-special-attack"];
export { register, module_name, module_dependency };
