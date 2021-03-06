import { Observable, Subject } from 'rxjs';
import { FactoryFunction } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { Storeable } from 'src/gameLogic/core/Factory/Factory';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { EnemyFormation } from 'src/gameLogic/custom/Class/Character/NPC/EnemyFormations/EnemyFormation';
import { PersistentCharacter } from 'src/gameLogic/custom/Class/Character/NPC/PersistentCharacter';
import { UniqueCharacter } from "src/gameLogic/custom/Class/Character/UniqueCharacter";
import { characterType } from "src/gameLogic/custom/Factory/CharacterFactory";
import { UniqueCharacterHandler } from './unique-character-handler';

export class PartyService implements Storeable{
  type:"PartyService"="PartyService"
  private _user: UniqueCharacter;
  private _party: [PersistentCharacter|null,PersistentCharacter|null] = [null, null];
  persistents: { [key: string]: PersistentCharacter } = {};

  private partySubject = new Subject < Character > ();
  private partyMemberSubject = new Subject < [number, Character | null]> ();
  private battleEnd = new Subject< [status:battle_end_status,enemy:EnemyFormation] > ();
  private uniqueCharacterHandler:UniqueCharacterHandler;
  private _enemyFormation:EnemyFormation;
  get enemyFormation():EnemyFormation { return this._enemyFormation}
  set enemyFormation(value:EnemyFormation) { this._enemyFormation = value; }
  constructor(gameSaver: GameSaver,uniqueCharacterHandler:UniqueCharacterHandler) {
    // @ts-ignore
    this._user = null;
    // @ts-ignore
    this._enemyFormation = null;
    this.uniqueCharacterHandler = uniqueCharacterHandler;
    gameSaver.register("Party",this)
  }
  get user():UniqueCharacter {
    return this._user as UniqueCharacter;
  }
  set user(user: UniqueCharacter) {
    this._user = user;
    this.updateUser()
  }
  get party(): UniqueCharacter[] {
    return this._party.filter(character => character !== null) as UniqueCharacter[];
  }
  getPersistent(characterTypeName: characterType) {
    return this.persistents[characterTypeName];
  }
  isPartyMember(character: Character): boolean {
    return character===this._user || (this._party as Character[]).includes(character);
  }
  setPartyMember(value: PersistentCharacter, index: 0 | 1) {
    if (![0, 1].includes(index)) return console.warn(`PartyMember index can be only 0|1 not:${index}`)
    this._party[index] = value;
    this.updatePartyMember(index);
  }
  updateUser(){ this.partySubject.next(this.user); }
  updatePartyMember(index: number){ this.partyMemberSubject.next([index, this._party[index]]); }
  battleEnded(status:battle_end_status){ this.battleEnd.next([status,this.enemyFormation]) }

  onUpdateUser(): Observable<Character>{ return this.partySubject.asObservable(); }
  onUpdatePartyMember(): Observable<[number, Character|null]>{ return this.partyMemberSubject.asObservable(); }
  onBattleEnded(): Observable<[status:battle_end_status,enemy:EnemyFormation]>{ return this.battleEnd.asObservable(); }

  get userParty():Character[]{
    return this.party.concat(this.user);
  }
  get enemyParty():Character[]{
    return this.enemyFormation.enemies;
  }

  toJson():PartyStoreable{
    return {
      Factory: "CurrentParty",
      type: 'party',
      dependencyGamesaveObjectKey: ["PersistentCharacter"],
      characterUiPosition1: this._party[0]?.type||null,
      characterUiPosition2: this._party[1]?.type||null,
    }
  }
  fromJson(options:PartyStoreable){
    this.setPartyMember(this.uniqueCharacterHandler.getCharacter(options.characterUiPosition1||"")||null,0);
    this.setPartyMember(this.uniqueCharacterHandler.getCharacter(options.characterUiPosition2||"")||null,1);
  }
}
export type PartyStoreable = {
  Factory: "CurrentParty";
  type: 'party';
  dependencyGamesaveObjectKey: ["PersistentCharacter"];
  characterUiPosition1: string|null;
  characterUiPosition2: string|null;
}
export const SetCurrentParty: FactoryFunction<void,PartyStoreable> = (masterService, options) => {
  masterService.partyHandler.fromJson(options)
}

type battle_end_status = 'victory'|'lost'|'escape'
