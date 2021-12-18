import { MasterService } from "src/app/service/master.service";
import { ActionOutput, Character, characterStats } from "src/gameLogic/custom/Class/Character/Character";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";
import { PersistentCharacter } from "../NPC/PersistentCharacter";

export class MainCharacter extends PersistentCharacter
{
  protected _name: string;
  characterType:characterType = "main-character";
  uuid = this.characterType;

  constructor(masterService:MasterService,name:string)
  {
    super(masterService,new TestMainCharacterBattleClass());
    masterService.gameSaver.register("MainCharacter",this)
    this._name = name;
  }

  get name(): string {
    return this._name;
  }
  _IA_Action(ally: Character[], enemy: Character[]): ActionOutput {
    throw new Error("Method not implemented.");
  }

}
