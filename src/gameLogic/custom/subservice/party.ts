import { Observable, Subject } from 'rxjs';
import { MasterService } from 'src/app/service/master.service';
import { FactoryFunction } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { UniqueCharacter } from "src/gameLogic/custom/Class/Character/UniqueCharacter";
import { PersistentCharacter } from 'src/gameLogic/custom/Class/Character/NPC/PersistentCharacter';
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory.type";
import { UniqueCharacterHandler } from './unique-character-handler';

export class PartyService implements storeable{
  private _user: UniqueCharacter;
  private _party: [PersistentCharacter,PersistentCharacter] = [null, null];
  persistents: { [key: string]: PersistentCharacter } = {};

  private partySubject = new Subject < Character > ();
  private partyMemberSubject = new Subject < [number, Character] > ();
  private unique_character_handler:UniqueCharacterHandler;

  constructor(gameSaver: GameSaver,unique_character_handler:UniqueCharacterHandler) {
    this._user = null;
    this.unique_character_handler = unique_character_handler;
    gameSaver.register("Party",this)
  }

  get user():UniqueCharacter {
    return this._user as UniqueCharacter;
  }
  get party(): UniqueCharacter[] {
    return this._party.filter(character => character !== null);
  }
  getPersistent(characterType: characterType) {
    return this.persistents[characterType];
  }
  set user(user: UniqueCharacter) {
    this._user = user;
    this.updateUser()
  }

  is_party_member(character: Character): boolean {
    return character===this._user || (this._party as Character[]).includes(character);
  }
  setPartyMember(value: PersistentCharacter, index: 0 | 1) {
    if (![0, 1].includes(index)) return console.warn(`PartyMember index can be only 0|1 not:${index}`)
    this._party[index] = value;
    this.updatePartyMember(index);
  }

  updateUser() {
    this.partySubject.next(this.user);
  }
  updatePartyMember(index: number) {
    this.partyMemberSubject.next([index, this._party[index]]);
  }
  onUpdateUser(): Observable < Character > {
    return this.partySubject.asObservable();
  }
  onUpdatePartyMember(): Observable < [number, Character] > {
    return this.partyMemberSubject.asObservable();
  }

  toJson():PartyStoreable
  {
    return {
      Factory: "CurrentParty",
      type: 'party',
      dependency_gamesave_object_key: ["PersistentCharacter"],
      characterUiPosition1: this._party[0]?.uuid||null,
      characterUiPosition2: this._party[1]?.uuid||null,
    }
  }
  fromJson(options:PartyStoreable)
  {
    this.setPartyMember(this.unique_character_handler.get_character(options.characterUiPosition1)||null,0);
    this.setPartyMember(this.unique_character_handler.get_character(options.characterUiPosition2)||null,1);
  }
}
export type PartyStoreable = {
  Factory: "CurrentParty";
  type: 'party';
  dependency_gamesave_object_key: ["PersistentCharacter"];
  characterUiPosition1: string;
  characterUiPosition2: string;
}
export const SetCurrentParty: FactoryFunction = (masterService: MasterService, options: PartyStoreable) => {
  masterService.partyHandler.fromJson(options)
}
