import { MasterService } from "src/app/service/master.service";
import { UniqueCharacter } from "src/gameLogic/custom/Class/Character/Character";

/**
 * A character with a name, adds/loads the name to/from the storeable json.
 *
 * @export
 * @abstract
 * @class PersistentCharacter
 * @extends {Character}
 */
export abstract class PersistentCharacter extends UniqueCharacter
{
  constructor(masterService:MasterService, character_battle_class=null)
  {
    super(masterService,character_battle_class)
    masterService.gameSaver.register('PersistentCharacter',this)
  }
}
