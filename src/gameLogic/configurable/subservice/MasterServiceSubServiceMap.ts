import { GameSaverMap } from 'src/gameLogic/configurable/subservice/game-saver.type';
import { FlagHandlerService } from 'src/gameLogic/core/subservice/flag-handler';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { DescriptionHandlerService } from 'src/gameLogic/custom/subservice/description-handler';
import { EnemyFormationService } from 'src/gameLogic/custom/subservice/enemy-formation';
import { GameStateService } from 'src/gameLogic/custom/subservice/game-state';
import { LockMapService } from 'src/gameLogic/custom/subservice/lock-map';
import { MapHandlerService } from 'src/gameLogic/custom/subservice/map-handler';
import { PartyService } from 'src/gameLogic/custom/subservice/party';
import { TimeHandler } from 'src/gameLogic/custom/subservice/time-handler';


export class MasterServiceSubServiceMap
{
  lockmap?:LockMapService;
  descriptionHandler?:DescriptionHandlerService;
  flagsHandler?:FlagHandlerService;
  mapHandler?:MapHandlerService;
  partyHandler?:PartyService;
  enemyHandler?:EnemyFormationService;
  gameStateHandler?:GameStateService;
  timeHandler?:TimeHandler;
  gameSaver?:GameSaver&GameSaverMap;
  updateCharacter?:(character:Character) => void;
}
