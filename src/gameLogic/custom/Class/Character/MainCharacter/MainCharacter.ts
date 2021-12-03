import { MasterService } from "src/app/service/master.service";
import { ActionOutput, Character, characterStats } from "src/gameLogic/custom/Class/Character/Character";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";

export class MainCharacter extends Character
{
  characterType:characterType = "main-character";
  private _name: string;
  constructor(originalStats:characterStats,masterService:MasterService,name:string)
  {
    super(originalStats,masterService);
    this._name = name;
    masterService.gameSaver.register("MainCharacter",this)
  }

  get name(): string {
    return this._name;
  }
  IA_Action(ally: Character[], enemy: Character[]): ActionOutput {
    throw new Error("Method not implemented.");
  }

}
