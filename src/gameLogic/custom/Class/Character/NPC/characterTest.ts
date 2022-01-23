import { EmptyCommand } from './../../Battle/BattleCommand';
import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { PersistentCharacter } from "src/gameLogic/custom/Class/Character/NPC/PersistentCharacter";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory";
import { randomBetween } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { BattleCommand } from "../../Battle/BattleCommand";

export class charTest extends PersistentCharacter
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
      const target = randomBetween(0,enemy.length-1);
      switch (randomBetween(0,2))
      {
          //ATTACK
          case 0: return this.Attack([enemy[target]]);
          //RANGE
          case 1: return this.Shoot(enemy);
          //DEFEND
          case 2: return this.Defend([this]);
          default: return new EmptyCommand(this, enemy);
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
