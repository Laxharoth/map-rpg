import { PersistentCharacter } from 'src/gameLogic/custom/Class/Character/NPC/PersistentCharacter';
import { FlagHandlerService } from "src/gameLogic/core/subservice/flag-handler";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { Shop } from "src/gameLogic/custom/Class/Shop/Shop";

enum GameSaveNames {
  MainCharacter='MainCharacter',
  Party='Party',
  PersistentCharacter='PersistentCharacter',
  PersistentShop='PersistentShop',
  Flags='Flags',
  Flags2='Flags2',
}
export type gamesavenames = keyof typeof GameSaveNames;
type GameSaveNamesFields = {[key in GameSaveNames]:any}

export interface GameSaverMap extends GameSaveNamesFields
{
  MainCharacter:Character[];
  Party:Character[];
  PersistentCharacter:PersistentCharacter[];
  PersistentShop:Shop[];
  Flags:[FlagHandlerService];
}
