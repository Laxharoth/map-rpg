import { characterType, persistentNames } from "src/app/customTypes/characterTypes";
import { MasterService } from "src/app/service/master.service";
import { Character } from "../Character";
import { CharacterFactory } from "./CharacterFactory";

/**
 * Converts a 'list' of characters in their json options.
 *
 * @export
 * @param {{[key: string]: Character}} characters The characters to convert.
 * @return {*} The storeable options.
 */
export function savePersistentNames(characters:{[key: string]: Character})
{
  const saveCharacter = {};
  for (const [type,character] of Object.entries(characters))
  {
    saveCharacter[type] = character.toJson();
  }
  return saveCharacter;
}

/**
 * Loads a group of characters from the array that defines persistent characters,
 * using a 'list' of storeable options to load the configuration of each character.
 *
 * @export
 * @param {MasterService} masterService The master service.
 * @param {{[key: string]: {[key: string]:any}}} characters A 'list' of the storeable options.
 * @return {[key: string]:Character} A list with the persistent characters.
 */
export function loadPersistentNames(masterService:MasterService,characters:{[key: string]: {[key: string]:any}}):{[key: string]:Character}
{
  const loadCharacter = {};
  for (const persistentName of persistentNames)
  {
    const options = characters?.[persistentName]||{};
    loadCharacter[persistentName] = CharacterFactory(masterService,persistentName, options);
  }
  return loadCharacter;
}
