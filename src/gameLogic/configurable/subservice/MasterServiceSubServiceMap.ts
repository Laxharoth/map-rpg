import { GameSaverMap } from 'src/gameLogic/configurable/subservice/game-saver.type';
import { FlagHandlerService } from 'src/gameLogic/core/subservice/flag-handler';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { SceneHandlerService } from 'src/gameLogic/custom/subservice/scene-handler';
import { FactWeb } from 'src/gameLogic/custom/subservice/fact-web';
import { GameStateService } from 'src/gameLogic/core/subservice/game-state';
import { InfoPageToggler } from 'src/gameLogic/custom/subservice/info-page-toggler';
import { LockMapService } from 'src/gameLogic/custom/subservice/lock-map';
import { MapHandlerService } from 'src/gameLogic/custom/subservice/map-handler';
import { PartyService } from 'src/gameLogic/custom/subservice/party';
import { TimeHandler } from 'src/gameLogic/custom/subservice/time-handler';
import { UniqueCharacterHandler } from 'src/gameLogic/custom/subservice/unique-character-handler';
import { QuestHolder } from 'src/gameLogic/custom/subservice/quest-holder';


export class MasterServiceSubServiceMap
{
  gameSaver?:GameSaver&GameSaverMap;
  flagsHandler?:FlagHandlerService;
  lockmap?:LockMapService;
  sceneHandler?:SceneHandlerService;
  mapHandler?:MapHandlerService;
  partyHandler?:PartyService;
  gameStateHandler?:GameStateService;
  timeHandler?:TimeHandler;
  FactWeb?:FactWeb;
  UniqueCharacterHandler?:UniqueCharacterHandler;
  InfoPageToggler?:InfoPageToggler
  QuestHolder?:QuestHolder
}
