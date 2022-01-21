import { UniqueCharacter } from "src/gameLogic/custom/Class/Character/UniqueCharacter";
import { GameSaver } from "src/gameLogic/core/subservice/game-saver";

export class UniqueCharacterHandler
{
  private _characters:{[key: string]:UniqueCharacter}={};

  constructor(game_saver: GameSaver){
    game_saver.on_change_persistent_instance().subscribe(([instance_name,action,character])=>{
      const unique_character = character as UniqueCharacter;
      if(!(instance_name==="MainCharacter" || instance_name==="PersistentCharacter"))return;
      if(action==="unregister"){delete this._characters[unique_character.uuid];return;}
      this._characters[unique_character.uuid] = unique_character
    })
  }
  get_character(uuid: string):UniqueCharacter{ return this._characters[uuid]; }
  get unique_characters():UniqueCharacter[]{ return Object.values(this._characters); }
}
