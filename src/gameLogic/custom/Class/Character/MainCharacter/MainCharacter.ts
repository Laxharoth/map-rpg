import { MasterService } from "src/app/service/master.service";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { UniqueCharacter } from "src/gameLogic/custom/Class/Character/UniqueCharacter";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory";
import { BattleCommand } from "../../Battle/BattleCommand";
export class MainCharacter extends UniqueCharacter{
  protected _name: string;
  type:characterType = "main-character";
  constructor(masterService:MasterService,name:string='', character_battle_type:string|null=null){
    super(masterService,character_battle_type);
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
