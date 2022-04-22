import { CharacterFactory } from 'src/gameLogic/custom/Factory/CharacterFactory';
import { UniqueCharacter } from "src/gameLogic/custom/Class/Character/UniqueCharacter";

import { characterType } from "../Factory/CharacterFactory";
import { MasterService } from "src/app/service/master.service";
import { Factory } from "src/gameLogic/core/Factory/Factory";

export class UniqueCharacterHandler{
  private _characters:{[key: string]:UniqueCharacter}={};
  private readonly masterService: MasterService;
  constructor(masterService:MasterService){
    this.masterService = masterService;
    const {gameSaver} = masterService;
    gameSaver.on_change_persistent_instance().subscribe(([instanceName,action,character])=>{
      const uniqueCharacter = character as UniqueCharacter;
      if(!(instanceName==="MainCharacter" || instanceName==="PersistentCharacter"))return;
      if(action==="unregister"){delete this._characters[uniqueCharacter.type];return;}
      this._characters[uniqueCharacter.type] = uniqueCharacter
    })
  }
  getCharacter(type: string):UniqueCharacter{
    let character:UniqueCharacter|undefined = this._characters[type];
    if(!character)
      character = (Factory as typeof
          CharacterFactory)(this.masterService,{ Factory:"Character",type:type as characterType  }) as UniqueCharacter
    return character;
  }
  get uniqueCharacters():UniqueCharacter[]{ return Object.values(this._characters); }
}
