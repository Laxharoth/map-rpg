import { CharacterFactory } from 'src/gameLogic/custom/Factory/CharacterFactory';
import { UniqueCharacter } from "src/gameLogic/custom/Class/Character/UniqueCharacter";

import { characterType } from "../Factory/CharacterFactory";
import { MasterService } from "src/app/service/master.service";
import { Factory } from "src/gameLogic/core/Factory/Factory";

export class UniqueCharacterHandler
{
  private _characters:{[key: string]:UniqueCharacter}={};
  private readonly masterService: MasterService;
  constructor(masterService:MasterService){
    this.masterService = masterService;
    const {gameSaver:game_saver} = masterService;
    game_saver.on_change_persistent_instance().subscribe(([instance_name,action,character])=>{
      const unique_character = character as UniqueCharacter;
      if(!(instance_name==="MainCharacter" || instance_name==="PersistentCharacter"))return;
      if(action==="unregister"){delete this._characters[unique_character.type];return;}
      this._characters[unique_character.type] = unique_character
    })
  }
  get_character(type: string):UniqueCharacter{
    let character:UniqueCharacter|undefined = this._characters[type];
    if(!character)
      character = (Factory as typeof CharacterFactory)(this.masterService,{ Factory:"Character",type:type as characterType  }) as UniqueCharacter
    return character;
  }
  get unique_characters():UniqueCharacter[]{ return Object.values(this._characters); }
}
