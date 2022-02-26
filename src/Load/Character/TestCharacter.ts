import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { MasterService } from "src/app/service/master.service";
import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { BattleCommand } from "src/gameLogic/custom/Class/Battle/BattleCommand";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { Enemy } from "src/gameLogic/custom/Class/Character/Enemy/Enemy";
import { GameItem, ItemStoreable } from "src/gameLogic/custom/Class/Items/Item";
import { itemname } from "src/gameLogic/custom/Class/Items/Item.type";
import { descriptionString, Scene } from "src/gameLogic/custom/Class/Scene/Scene";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory";

const register:register_function = ({character,enemy_formation}, {character:{Character,PersistentCharacter,UniqueCharacter}, enemy_formation:{EnemyFormation} },Factory)=>{
  const GameItemFactory = Factory as typeof ItemFactory;

  const EmptyCommand:(that:Character,enemy:Character[])=>BattleCommand = (that,enemy)=>{ return {
    source:that,
    target:enemy,
    tags:[],
    excecute:() => [[],[]],
  }}
  class charTest extends PersistentCharacter
  {
    protected _name!: string;
    type:characterType = "test character";
    constructor(masterService:MasterService ,name:string='')
    {
      super(masterService);
      //@ts-ignore
      this.masterService.gameSaver.unregister("PersistentCharacter",this)
      this._name = name
      this.uuid = this._name;
      //@ts-ignore
      this.masterService.gameSaver.register("PersistentCharacter",this)
    }

    get name(): string { return this._name; }
    set name(name: string) { this._name = name;}
    _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
        const target = Factory.randomBetween(0,enemy.length-1);
        switch (Factory.randomBetween(0,2))
        {
            //ATTACK
            case 0: return this.Attack([enemy[target]]);
            //RANGE
            case 1: return this.Shoot(enemy);
            //DEFEND
            case 2: return this.Defend([this]);
            default: return EmptyCommand(this,enemy);
        }
    }
    fromJson(options)
    {
      super.fromJson(options);
      this.uuid = this._name;
      //@ts-ignore
      this.masterService.gameSaver.unregister("PersistentCharacter",this)
      //@ts-ignore
      this.masterService.gameSaver.register("PersistentCharacter",this)
    }
  }
  class enemyTest extends Character implements Enemy
  {
    _name="enemyTest";
    enemy_type: string = "enemyTest";
    type:characterType = 'test enemy';
    constructor(masterService:MasterService)
    { super(masterService,'TestCharacterBattleClass') }
    get name(): string {
        return 'test enemy';
    }
    _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
        const target = Factory.randomBetween(0,ally.length-1);
        switch (Factory.randomBetween(0,2))
        {
            //ATTACK
            case 0: return this.Attack([ally[target]]);
            //RANGE
            case 1: return this.Shoot([ally[target]]);
            //DEFEND
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
    base_experience: number = 20;

    private select_loot():itemname
    {
      if(Factory.randomCheck(10))return 'ShieldGuard'
      return 'item-test'
    }
  }
  class JohnSmith extends PersistentCharacter
  {
    protected _name: string = "John Smith";
    type: characterType= 'john';
    uuid=this.type;
    constructor(masterService:MasterService)
    {
      super(masterService);
      masterService.gameSaver.register('PersistentCharacter',this)
    }
    _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
      throw new Error("Method not implemented.");
    }
  }
  class testformation extends EnemyFormation
  {
    type:string = "testformation";
    constructor(masterService:MasterService){
        super(masterService)
        //this._enemies = Array.from(Array(randomBetween(1,3))).map(_=>new enemyTest(this.masterService))
        this._enemies = [new enemyTest(this.masterService)]
        this._enemies = [new enemyTest(this.masterService),new enemyTest(this.masterService)]
    }
    protected escapeSuccess():descriptionString{
      return ()=>`${this.masterService.partyHandler.user.name} escapes`;
    }
    protected escapeFail():descriptionString{
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
        return {sceneData:()=>`Enemy won`, options,fixed_options:[null,null,null,null,null]}
    }
    //////////////////////////
    // Party Victory
    //////////////////////////
    private partyVictory(party: Character[]): Scene {
      party.forEach(char=>{char.healHitPoints(10)})
        const options = [this.exitOption('next')]
        return {sceneData:()=>`Party won`, options,fixed_options:[null,null,null,null,null]}
    }
  }
  character["test character"] = charTest;
  character["enemyTest"] = enemyTest;
  character["john"] = JohnSmith;
  enemy_formation["testformation"] = testformation;
}

const module_name="TestCharacters";
const module_dependency=["EquipmentTest"]

export {register, module_name, module_dependency}
