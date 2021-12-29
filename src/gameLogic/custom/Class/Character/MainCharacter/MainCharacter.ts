import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { CharacterStoreable, UniqueCharacter } from "src/gameLogic/custom/Class/Character/UniqueCharacter";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";
import { BattleCommand } from "../../Battle/BattleCommand";
import { CharacterBattleClass } from "../../CharacterBattleClass/CharacterBattleClass";

export class MainCharacter extends UniqueCharacter
{
  protected _name: string;
  characterType:characterType = "main-character";
  uuid = this.characterType;
  protected character_battle_class:CharacterBattleClass;

  constructor(masterService:MasterService,name:string, character_battle_class=null)
  {
    super(masterService,character_battle_class);
    masterService.gameSaver.register("MainCharacter",this)
    this._name = name;
  }

  get name(): string {
    return this._name;
  }
  _IA_Action(ally: Character[], enemy: Character[]): BattleCommand {
    throw new Error("Method not implemented.");
  }
}
