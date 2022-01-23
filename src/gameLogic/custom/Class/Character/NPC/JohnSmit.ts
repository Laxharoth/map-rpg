import { BattleCommand } from './../../Battle/BattleCommand';
import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { PersistentCharacter } from "src/gameLogic/custom/Class/Character/NPC/PersistentCharacter";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory";

export class JohnSmith extends PersistentCharacter
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
