import { characterType, persistentNames } from "src/app/customTypes/characterTypes";
import { MasterService } from "../../masterService";
import { Character } from "../Character";
import { CharacterFactory } from "./CharacterFactory";

export function savePersistentNames(characters:{[key: string]: Character})
{
  const saveCharacter = {};
  for (const [type,character] of Object.entries(characters))
  {
    saveCharacter[type] = character.toJson();
  }
  return saveCharacter;
}
export function loadPersistentNames(masterService:MasterService,characters:{[key: string]: {[key: string]:any}})
{
  const loadCharacter = {};
  for (const persistentName of persistentNames)
  {
    const options = characters?.[persistentName]||{};
    loadCharacter[persistentName] = CharacterFactory(masterService,persistentName, options);
  }
  return loadCharacter;
}
