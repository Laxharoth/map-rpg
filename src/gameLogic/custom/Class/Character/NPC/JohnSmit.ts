import { MasterService } from "src/app/service/master.service";
import { ActionOutput, Character } from "src/gameLogic/custom/Class/Character/Character";
import { PersistentCharacter } from "src/gameLogic/custom/Class/Character/NPC/PersistentCharacter";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";

export class JohnSmith extends PersistentCharacter
{
  protected _name: string = "John Smith";
  characterType: characterType= 'john';
  constructor(masterService:MasterService)
  {
    super({},masterService);
    masterService.gameSaver.register('PersistentCharacter',this)
  }
  IA_Action(ally: Character[], enemy: Character[]): ActionOutput {
    throw new Error("Method not implemented.");
  }
}