import { Character, CharacterStoreable } from "src/gameLogic/custom/Class/Character/Character";

/**
 * A character with a name, adds/loads the name to/from the storeable json.
 *
 * @export
 * @abstract
 * @class PersistentCharacter
 * @extends {Character}
 */
export abstract class PersistentCharacter extends Character
{
  constructor(masterService:MasterService)
  {
    super(masterService)
    masterService.gameSaver.register('PersistentCharacter',this)
  }
  protected abstract _name:string;
  uuid:string;
  get name():string {return this._name};
  toJson():PersistentCharacterStoreable
  {
    const userjson:PersistentCharacterStoreable = {uuid:this.uuid,name:this.name,...super.toJson()};
    return userjson;
  }
  fromJson(options:PersistentCharacterStoreable): void
  {
    super.fromJson(options);
    this._name = options.name;
  }
}

export type PersistentCharacterStoreable = {uuid:string;name:string}&CharacterStoreable
