import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { PersistentCharacter } from "src/gameLogic/custom/Class/Character/NPC/PersistentCharacter";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";

export class JohnSmith extends PersistentCharacter
{
  protected _name: string = "John Smith";
  characterType: characterType= 'john';
  uuid=this.characterType;
  constructor(masterService:MasterService)
  {
    super(masterService);
    masterService.gameSaver.register('PersistentCharacter',this)
  }
  _IA_Action(ally: Character[], enemy: Character[]): ActionOutput {
    throw new Error("Method not implemented.");
  }
}
