import { DescriptableSceneOptions } from './../../gameLogic/custom/Class/Scene/Scene';
import { PerkFactory } from 'src/gameLogic/custom/Factory/PerkFactory';
import { MasterService } from "src/app/service/master.service";
import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { BattleCommand, SelectCommandTargetStrategy, SelectSingleTargetStrategy } from "src/gameLogic/custom/Class/Battle/BattleCommand";
import { Character as CharacterClass } from "src/gameLogic/custom/Class/Character/Character";
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

const register: registerFunction = ({ enemyFormation, characterBattleClass, character },
  {
    enemyFormation: { EnemyFormation },
    characterBattleClass: { CharacterBattleClass },
    character: { Character, PersistentCharacter, UniqueCharacter }
  }, Factory) => {
  const perkFactory = Factory as typeof PerkFactory;
  const possibleTargets = (
    user:CharacterClass,userally: CharacterClass[], enemy: CharacterClass[],battleUseable:BattleUseable
    )=>[
      ...battleUseable.isSelfUsable?[user]:[],
      ...battleUseable.isPartyUsable?userally:[],
      ...battleUseable.isEnemyUsable?enemy:[],
    ]
  const randomAnyTarget = (targets: CharacterClass[]) => {
    const target = targets[Math.floor(Math.random() * targets.length)];
    return [target];
  }
  const selectSingleEnemyMaxHP:SelectSingleTargetStrategy =
      (user, userally: CharacterClass[], enemies: CharacterClass[]) => {
    const maxHP = Math.max(...enemies.map(enemy => enemy.currentEnergyStats.hitpoints));
    return [enemies.find(enemy => enemy.currentEnergyStats.hitpoints === maxHP) || enemies[0]];
  }
  const AttackOrDefend:SelectCommandTargetStrategy = (user,ally,enemy,targetStrategy)=>{
    if(Factory.randomCheck(95)){
      return user.Attack(targetStrategy(user,ally,enemy));
    }
    return user.Defend([user]);
  }
  abstract class EnemyBaseClass extends CharacterBattleClass{
    protected _initialPhysicStats: CoreStats = {
      strenght:1,
      aim:1,
      intelligence:1,
      speed:1,
      stamina:1,
    };
    protected _upgradeTree: ArrayTree<Upgrade> | tree_node<UpgradeOptions>[] = [];
    experienceCap: experience_cap = [0,0,0,0,0];
  }
  // tslint:disable: max-classes-per-file
  class Bandit extends EnemyBaseClass{
    type: string = "Bandit";
    name: string = "Bandit";
    protected _calculateStats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:11*stamina,
        energypoints:0,
        physicalAttack:1.1*strenght,
        rangedAttack:1.2*aim,
        physicalDefence:1.2*stamina,
        rangedDefence:1.2*speed,
        accuracy:1.2*(intelligence+speed)/2,
        evasion:1.2*(intelligence+speed)/2,
        initiative:30*speed,
      }
    }
  }
  class Guard extends EnemyBaseClass{
    type: string = "Guard";
    name: string = "Guard";
    protected _calculateStats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:11*stamina,
        energypoints:0,
        physicalAttack:1.3*strenght,
        rangedAttack:1*aim,
        physicalDefence:1.6*stamina,
        rangedDefence:1.7*speed,
        accuracy:1.2*(intelligence+speed)/2,
        evasion:1.2*(intelligence+speed)/2,
        initiative:25*speed,
      }
    }
  }
  class Spy extends EnemyBaseClass{
    type: string = "Spy";
    name: string = "Spy";
    protected _calculateStats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:27,
        energypoints:20,
        physicalAttack:1.0*strenght,
        rangedAttack:1.5*aim*speed*intelligence/3,
        physicalDefence:1.2*stamina,
        rangedDefence:1.2*speed,
        accuracy:1.5*aim*intelligence/2,
        evasion:1.5*aim*intelligence/2,
        initiative:30*speed*intelligence/2,
      }
    }
  }
  class Thug extends EnemyBaseClass{
    type: string = "Thug ";
    name: string = "Thug ";
    protected _initialPhysicStats: CoreStats = { ...super.initialPhysicStats, stamina:2 };
    protected _calculateStats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:16*stamina,
        energypoints:16*stamina,
        physicalAttack:15*strenght,
        rangedAttack:15*speed,
        physicalDefence:6*stamina,
        rangedDefence:6*stamina,
        accuracy:11*aim,
        evasion:11*aim,
        initiative:30*speed,
      }
    }
  }
  abstract class BaseEnemy extends Character implements Enemy{
    abstract enemyType: string;
    baseExperience: number = 25;
    get loot(): ItemStoreable[] {
      return [];
    }
    protected _IA_Action(ally: CharacterClass[], enemy: CharacterClass[]): BattleCommand {
      return this.Attack(ally);
    }
  }
  class BanditEnemy extends BaseEnemy{
    protected _name: string = "Bandit";
    type: characterType="Bandit";
    enemyType: string = "Bandit";
    constructor(masterService:MasterService){
      super(masterService,"Bandit");
    }
    protected _IA_Action(ally: CharacterClass[], enemy: CharacterClass[]): BattleCommand {
      const net = this.inventory.find("Net");
      if(net){
        return this.useItem(net,selectSingleEnemyMaxHP(this,ally,enemy));
      }
      return AttackOrDefend(this,ally,enemy,selectSingleEnemyMaxHP)
    }
  }
  class GuardEnemy extends BaseEnemy{
    enemyType: string="Guard";
    protected _name: string="Guard";
    type: characterType="Guard";
    constructor(masterService:MasterService){
      super(masterService,"Guard");
      this.addPerk(perkFactory(this.masterService,{Factory:"Perk",type:"BlindInmune"}));
    }
    protected _IA_Action(ally: CharacterClass[], enemy: CharacterClass[]): BattleCommand {
      return AttackOrDefend(this,ally,enemy,selectSingleEnemyMaxHP)
    }
  }
  class Seller extends PersistentCharacter implements Enemy{
    enemyType: string="Spy";
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
    baseExperience: number = 10;
    protected _IA_Action(ally: CharacterClass[], enemy: CharacterClass[]): BattleCommand {
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
    enemyType: string = "Thug";
    constructor(masterService:MasterService){
      super(masterService,"Thug");
      this.addPerk(perkFactory(this.masterService,{Factory:"Perk",type:"PackTactics"}))
      this.addPerk(perkFactory(this.masterService,{Factory:"Perk",type:"MultiAttack"}))
    }
    protected _IA_Action(ally: CharacterClass[], enemy: CharacterClass[]): BattleCommand {
      const multyAttack = this.specialAttacks.get("MultiAttack");
      if(multyAttack && !multyAttack.disabled(this) && Factory.randomCheck(5)){
        return this.useItem(multyAttack,selectSingleEnemyMaxHP(this,ally,enemy));
      }
      return AttackOrDefend(this,ally,enemy,selectSingleEnemyMaxHP)
    }
  }
  class SellerCrew extends EnemyFormation{
    type="SellerCrew";
    protected _enemies: (CharacterClass & Enemy)[];
    constructor(masterService:MasterService){
      super(masterService);
      this._enemies = [
        masterService.UniqueCharacterHandler.getCharacter("DragonSeller") as unknown as (CharacterClass & Enemy),
        new GuardEnemy(masterService),
        new GuardEnemy(masterService),
      ];
    }
    onEnemyVictory(party: CharacterClass[]): Scene {
      return {
        sceneData(){return "The seller open a secret door and escapes."},
        options:[
          Factory.options.nextOption(this.masterService)
        ]
      };
    }
    onPartyVictory(party: CharacterClass[]): Scene {
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
    protected escapeCheck(party: CharacterClass[]): boolean {
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
    protected get _enemies(): (CharacterClass & Enemy)[]{
      return [
        this.boss,
        ...this.bandits.sort( (bandit1,bandit2)=>Number(bandit1.isDefeated() && !bandit2.isDefeated())).slice(2)
      ];
    }
    get IsDefeated(): boolean {
      return this.boss.isDefeated();
    }
    onEnemyVictory(party: CharacterClass[]): Scene {
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
    onPartyVictory(party: CharacterClass[]): Scene {
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
    protected escapeCheck(party: CharacterClass[]): boolean {
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
    protected _enemies: (CharacterClass & Enemy)[] = [
      new BanditEnemy(this.masterService), new BanditEnemy(this.masterService), ]
    onEnemyVictory(party: CharacterClass[]): Scene {
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
    onPartyVictory(party: CharacterClass[]): Scene {
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
    protected escapeCheck(party: CharacterClass[]): boolean {
      return Factory.randomCheck(30);
    }
  }
  abstract class BaseUserClass extends CharacterBattleClass{
    protected _initialPhysicStats: CoreStats = {
      strenght:1,
      aim:1,
      intelligence:1,
      speed:1,
      stamina:1,
    };
    protected _upgradeTree: ArrayTree<Upgrade> | tree_node<UpgradeOptions>[] = [];
    experienceCap: experience_cap = [0,0,0,0,0];
  }
  class Fighter extends BaseUserClass{
    type: string = "Fighter";
    name: string = "Fighter";
    protected _calculateStats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:6*stamina,
        energypoints:3*stamina,
        physicalAttack:7*strenght,
        rangedAttack:4*speed,
        physicalDefence:6*stamina,
        rangedDefence:6*stamina,
        accuracy:5*aim,
        evasion:5*aim,
        initiative:10*speed,
      }
    }
  }
  class Monk extends BaseUserClass{
    type: string = "Monk";
    name: string = "Monk";
    protected _calculateStats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:7*stamina,
        energypoints:3*stamina,
        physicalAttack:3*(strenght+speed),
        rangedAttack:2*speed,
        physicalDefence:Math.round(5*(stamina+speed)/3),
        rangedDefence:Math.round(5*(stamina+speed)/3),
        accuracy:5*(aim+speed),
        evasion:5*(aim+speed),
        initiative:13*(speed+intelligence),
      }
    }
  }
  class Cleric extends BaseUserClass{
    type: string = "Monk";
    name: string = "Monk";
    protected _calculateStats({ strenght, stamina, aim, speed, intelligence, }: FullCoreStats): CalculatedStats {
      return {
        hitpoints:6*stamina,
        energypoints:5*intelligence,
        physicalAttack:Math.round(3*(strenght+intelligence/2)),
        rangedAttack:2*speed,
        physicalDefence:Math.round(5*(stamina+speed)/3),
        rangedDefence:Math.round(5*(stamina+speed)/3),
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
    protected _IA_Action(ally: CharacterClass[], enemy: CharacterClass[]): BattleCommand {
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
    protected _IA_Action(allies: CharacterClass[], enemy: CharacterClass[]): BattleCommand {
      const guidance = this.specialAttacks.get("Guidance");
      const mending = this.specialAttacks.get("Mending");
      const sacredFlame = this.specialAttacks.get("SacredFlame");
      if(guidance && !guidance.disabled(this)){
        const targets = possibleTargets(this,allies,enemy, guidance);
        this.useItem(guidance,randomAnyTarget(targets));
      }
      const hurtedAlly = allies.find(
        ally => ally.currentEnergyStats.hitpoints / ally.calculatedStats.hitpoints < 0.25 );
      if(mending && !mending.disabled(this) && hurtedAlly ){
        this.useItem(mending,[hurtedAlly]);
      }
      if(sacredFlame && !sacredFlame.disabled(this) && Factory.randomCheck(29)){
        this.useItem(sacredFlame,selectSingleEnemyMaxHP(this,allies,enemy));
      }
      return AttackOrDefend(this,allies,enemy,selectSingleEnemyMaxHP)
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
  // tslint:disable: no-string-literal
  characterBattleClass["Bandit"]=Bandit;
  characterBattleClass["Guard"]=Guard;
  characterBattleClass["Spy"]=Spy;
  characterBattleClass["Thug"]=Thug;
  character["Bandit"] = BanditEnemy;
  character["Guard"] = GuardEnemy;
  character["DragonSeller"] = Seller;
  character["Thug"] = ThugEnemy;
  enemyFormation["SellerCrew"]=SellerCrew;
  enemyFormation["ThugCrew"]=ThugCrew;
  enemyFormation["Bandits"]=Bandits;
  characterBattleClass["Cleric"]=Cleric;
  characterBattleClass["Monk"]=Monk;
  characterBattleClass["Fighter"]=Fighter;
  character["FrankiePeanuts"] = FrankiePeanuts;
  character["BishopVault"] = BishopVault;
  character["Timber"] = Timber;
}
const moduleName = "small-campaign-battle-class";
const moduleDependency:string[] = ["small-campaign-reaction","small-campaign-special-attack"];
export { register, moduleName, moduleDependency };
