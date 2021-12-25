import { GameSaverMap } from 'src/gameLogic/configurable/subservice/game-saver.type';
import { FlagHandlerService } from 'src/gameLogic/core/subservice/flag-handler';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { DescriptionHandlerService } from 'src/gameLogic/custom/subservice/description-handler';
import { EnemyFormationService } from 'src/gameLogic/custom/subservice/enemy-formation';
import { FactWeb } from 'src/gameLogic/custom/subservice/fact-web';
import { GameStateService } from 'src/gameLogic/custom/subservice/game-state';
import { LockMapService } from 'src/gameLogic/custom/subservice/lock-map';
import { MapHandlerService } from 'src/gameLogic/custom/subservice/map-handler';
import { PartyService } from 'src/gameLogic/custom/subservice/party';
import { TimeHandler } from 'src/gameLogic/custom/subservice/time-handler';
import { UniqueCharacterHandler } from 'src/gameLogic/custom/subservice/unique-character-handler';


export class MasterServiceSubServiceMap
{
  gameSaver?:GameSaver&GameSaverMap;
  flagsHandler?:FlagHandlerService;
  lockmap?:LockMapService;
  descriptionHandler?:DescriptionHandlerService;
  mapHandler?:MapHandlerService;
  partyHandler?:PartyService;
  enemyHandler?:EnemyFormationService;
  gameStateHandler?:GameStateService;
  timeHandler?:TimeHandler;
  FactWeb?:FactWeb;
  UniqueCharacterHandler?:UniqueCharacterHandler;
  updateCharacter?:(character:Character) => void;
}
