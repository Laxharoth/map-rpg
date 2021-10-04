import { MasterService } from "src/app/service/master.service";
import { characterType } from "src/app/customTypes/characterTypes";
import { ActionOutput } from "src/app/customTypes/customTypes";
import { Character } from "../Character";
import { PersistentCharacter } from "./PersistentCharacter";

export class JohnSmith extends PersistentCharacter
{
  protected _name: string = "John Smith";
  characterType: characterType= 'john';
  constructor(masterService:MasterService)
  {
    super({},masterService);
  }
  IA_Action(ally: Character[], enemy: Character[]): ActionOutput {
    throw new Error("Method not implemented.");
  }
}
