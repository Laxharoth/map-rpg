import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { MasterService } from "src/app/service/master.service";
import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { BattleCommand } from "src/gameLogic/custom/Class/Battle/BattleCommand";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { Enemy } from "src/gameLogic/custom/Class/Character/Enemy/Enemy";
import { GameItem, ItemStoreable } from "src/gameLogic/custom/Class/Items/Item";
import { itemname } from "src/gameLogic/custom/Class/Items/Item.type";
import { Scene } from "src/gameLogic/custom/Class/Scene/Scene";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory";
import { UniqueCharacterStoreable } from 'src/gameLogic/custom/Class/Character/UniqueCharacter';

const register:registerFunction = ({character,enemyFormation},
    // tslint:disable-next-line: no-shadowed-variable
    {character:{Character,PersistentCharacter,UniqueCharacter},
    enemyFormation:{EnemyFormation} },Factory)=>{
  const GameItemFactory = Factory as typeof ItemFactory;

  const EmptyCommand:(that:Character,enemy:Character[])=>BattleCommand = (that,enemy)=>{ return {
    source:that,
    target:enemy,
    tags:[],
    excecute:() => [[],[]],
  }}
  class CharTest extends PersistentCharacter{
    protected _name!: string;
    type:characterType = "test character";
    constructor(masterService:MasterService ,name:string=''){
      super(masterService);
      // @ts-ignore
      this.masterService.gameSaver.unregister("PersistentCharacter",this)
      this._name = name
      // @ts-ignore
      this.type = this._name;
      // @ts-ignore
      this.masterService.gameSaver.register("PersistentCharacter",this)
    }

    get name(): string { return this._name; }
    set name(name: string) { this._name = name;}
    _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
        const target = Factory.randomBetween(0,enemy.length-1);
        switch (Factory.randomBetween(0,2))
        {
            // ATTACK
            case 0: return this.Attack([enemy[target]]);
            // RANGE
            case 1: return this.Shoot(enemy);
            // DEFEND
            case 2: return this.Defend([this]);
            default: return EmptyCommand(this,enemy);
        }
    }
    fromJson(options:UniqueCharacterStoreable)
    {
      super.fromJson(options);
      // @ts-ignore
      this.type = this._name;
      // @ts-ignore
      this.masterService.gameSaver.unregister("PersistentCharacter",this)
      // @ts-ignore
      this.masterService.gameSaver.register("PersistentCharacter",this)
    }
  }
  // tslint:disable-next-line: max-classes-per-file
  class EnemyTest extends Character implements Enemy{
    _name="enemyTest";
    enemyType: string = "enemyTest";
    type:characterType = 'test enemy';
    constructor(masterService:MasterService)
    { super(masterService,'TestCharacterBattleClass') }
    get name(): string {
        return 'test enemy';
    }
    _IA_Action(_ally: Character[], enemy: Character[]): BattleCommand {
        const target = Factory.randomBetween(0,enemy.length-1);
        switch (Factory.randomBetween(0,2))
        {
            // ATTACK
            case 0: return this.Attack([enemy[target]]);
            // RANGE
            case 1: return this.Shoot([enemy[target]]);
            // DEFEND
            case 2: return this.Defend([this]);
            default: return EmptyCommand(this,[]);
        }
    }
    get loot():ItemStoreable[]
    {
      return [
        {
          Factory:'Item',
          type:this.select_loot(),
        }
      ]
    }
    baseExperience: number = 20;

    private select_loot():itemname
    {
      if(Factory.randomCheck(10))return 'ShieldGuard'
      return 'item-test'
    }
  }
  // tslint:disable-next-line: max-classes-per-file
  class JohnSmith extends UniqueCharacter{
    protected _name: string = "John Smith";
    type: characterType= 'john';
      // @ts-ignore
    type=this.type;
    constructor(masterService:MasterService){
      super(masterService);
      masterService.gameSaver.register('PersistentCharacter',this)
    }
    _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
      throw new Error("Method not implemented.");
    }
  }
  // tslint:disable-next-line: max-classes-per-file
  class Testformation extends EnemyFormation{
    type:string = "testformation";
    constructor(masterService:MasterService){
        super(masterService)
        // this._enemies = Array.from(Array(randomBetween(1,3))).map(_=>new enemyTest(this.masterService))
        this._enemies = [new EnemyTest(this.masterService)]
        this._enemies = [new EnemyTest(this.masterService),new EnemyTest(this.masterService)]
    }
    protected escapeSuccess():string{
      return `${this.masterService.partyHandler.user.name} escapes`;
    }
    protected escapeFail():string{
      throw Error("");
    }
    protected escapeCheck(party: Character[]):boolean{
      return true;
    }
    protected _enemies: (Character&Enemy)[];
    onEnemyVictory(party: Character[]): Scene {
        return this.enemyVictory(party)
    }
    onPartyVictory(party: Character[]): Scene {
        return this.partyVictory(party)
    }
    loot():GameItem[]{
      const Item = GameItemFactory(this.masterService,{Factory:"Item",type:"item-test"})
      Item.amount = Factory.randomBetween(1,4);
      const weapon = GameItemFactory(this.masterService,{ Factory:'Item',type:'MeleeTest'})
      return [Item,weapon];
    }
    //////////////////////////
    // Enemy Victory
    //////////////////////////
    private enemyVictory(party: Character[]): Scene {
      party.forEach(char=>{char.healHitPoints(Infinity)})
        const options = [this.exitOption('next')]
        return {sceneData:()=>`Enemy won`, options,fixedOptions:[null,null,null,null,null]}
    }
    //////////////////////////
    // Party Victory
    //////////////////////////
    private partyVictory(party: Character[]): Scene {
      party.forEach(char=>{char.healHitPoints(10)})
        const options = [this.exitOption('next')]
        return {sceneData:()=>`Party won`, options,fixedOptions:[null,null,null,null,null]}
    }
  }
  character["test character"] = CharTest;
  character.enemyTest = EnemyTest;
  character.john = JohnSmith;
  enemyFormation.testformation = Testformation;
}

const moduleName="TestCharacters";
const moduleDependency:string[]=["EquipmentTest"]

export {register, moduleName, moduleDependency}
