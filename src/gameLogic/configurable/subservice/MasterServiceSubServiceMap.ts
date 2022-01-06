import { GameSaverMap } from 'src/gameLogic/configurable/subservice/game-saver.type';
import { FlagHandlerService } from 'src/gameLogic/core/subservice/flag-handler';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { DescriptionHandlerService } from 'src/gameLogic/custom/subservice/description-handler';
import { FactWeb } from 'src/gameLogic/custom/subservice/fact-web';
import { GameStateService } from 'src/gameLogic/custom/subservice/game-state';
import { InfoPageToggler } from 'src/gameLogic/custom/subservice/info-page-toggler';
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
  gameStateHandler?:GameStateService;
  timeHandler?:TimeHandler;
  FactWeb?:FactWeb;
  UniqueCharacterHandler?:UniqueCharacterHandler;
  InfoPageToggler?:InfoPageToggler
}
