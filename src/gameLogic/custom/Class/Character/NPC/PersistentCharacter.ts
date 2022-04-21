import { MasterService } from "src/app/service/master.service";
import { UniqueCharacter } from "src/gameLogic/custom/Class/Character/UniqueCharacter";

/** A character with a name, adds/loads the name to/from the storeable json. */
export abstract class PersistentCharacter extends UniqueCharacter{
  constructor(masterService:MasterService, character_battle_class:string|null=null){
    super(masterService,character_battle_class)
    masterService.gameSaver.register('PersistentCharacter',this)
  }
}
