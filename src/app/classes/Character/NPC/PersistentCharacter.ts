import { Character } from "../Character";

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
  protected abstract _name:string;
  get name():string {return this._name};
  toJson():{[key: string]:any}
  {
    const userjson = super.toJson();
    userjson.name = this._name;
    return userjson;
  }
  fromJson(options: {[key: string]: any}): void
  {
    super.fromJson(options);
    this._name = options.name;
  }
}
