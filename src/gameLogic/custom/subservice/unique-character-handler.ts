import { UniqueCharacter } from 'src/gameLogic/custom/Class/Character/Character';
import { GameSaver } from "src/gameLogic/core/subservice/game-saver";

export class UniqueCharacterHandler
{
  private _characters:{[key: string]:UniqueCharacter}={};

  constructor(game_saver: GameSaver){
    game_saver.on_change_persistent_instance().subscribe(([instance_name,action,character])=>{
      if(!(instance_name==="MainCharacter" || instance_name==="PersistentCharacter") || action==="unregister")return;
      const unique_character = character as UniqueCharacter;
      this._characters[unique_character.uuid] = unique_character
    })
  }
  get_character(uuid: string):UniqueCharacter{ return this._characters[uuid]; }
  get unique_characters():UniqueCharacter[]{ return Object.values(this._characters); }
}
