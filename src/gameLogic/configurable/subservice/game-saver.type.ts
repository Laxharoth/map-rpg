import { FlagHandlerService } from "src/gameLogic/core/subservice/flag-handler";
import { Shop } from "src/gameLogic/custom/Class/Shop/Shop";
import { UniqueCharacter } from "src/gameLogic/custom/Class/Character/UniqueCharacter";

enum GameSaveNames {
  MainCharacter='MainCharacter',
  Party='Party',
  PersistentCharacter='PersistentCharacter',
  PersistentShop='PersistentShop',
  Flags='Flags',
  Flags2='Flags2',
  FactWeb='FactWeb',
  TimeHandler='TimeHandler',
}
export type gamesavenames = keyof typeof GameSaveNames;

export interface GameSaverMap
{
  MainCharacter:UniqueCharacter[];
  Party:UniqueCharacter[];
  PersistentCharacter:UniqueCharacter[];
  PersistentShop:Shop[];
  Flags:[FlagHandlerService];
}
