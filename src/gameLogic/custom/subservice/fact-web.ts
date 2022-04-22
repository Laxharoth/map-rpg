import { Subscription } from 'rxjs';
import { FactoryFunction } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { gamesavenames } from 'src/gameLogic/configurable/subservice/game-saver.type';
import { Storeable } from 'src/gameLogic/core/Factory/Factory';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { UniqueCharacter } from "src/gameLogic/custom/Class/Character/UniqueCharacter";
import { floorTo, randomCheck, setEquality } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { Time } from './../ClassHelper/Time';
import { acquaintaceness, CharacterDataWebData, factName,
         factImportance as factImportance,
         hashed_acquanitance as hashedAcquanitance } from './fact-web.type';
import { TimeHandler } from './time-handler';
import { UniqueCharacterHandler } from './unique-character-handler';

export class FactWeb implements Storeable{
  type:"FactWeb"="FactWeb";
  static readonly TIME_INTERVAL_2_SPREAD = 1440;
  private static readonly SPREAD_COEFFICIENT = 20;
  private lastSpreadTime = 0;
  private uniqueCharacterHandler:UniqueCharacterHandler;
  private knownFacts:Map<factName,Fact> = new Map();
  private characterMap:Map<string,CharacterDataWebData> = new Map();
  private spreadSubscriptions:Subscription|null = null;
  private createSubscriptions:()=>void

  /** Stores a group of facts, then spreads them through a graph of characters. */
  constructor(timeHandler:TimeHandler, gameSaver:GameSaver,uniqueCharacterHandler:UniqueCharacterHandler){
    gameSaver.register("FactWeb",this);
    this.uniqueCharacterHandler = uniqueCharacterHandler;
    this.createSubscriptions = ()=>{
      if(!this.spreadSubscriptions)this.spreadSubscriptions = timeHandler
        .onTimeChanged().subscribe( time => this.spreadFact(time) )
    }
  }
  private initializeCharacterMap(){
    for(const character of this.uniqueCharacterHandler.uniqueCharacters)
      this.initializeCharacter(character);
  }
  private initializeCharacter(character: UniqueCharacter) {
    this.characterMap.set(character.type, {
      knownFacts: new Set(),
      acquaintacerMap: new Map(),
    });
  }
  getFact(factname:factName){ return this.knownFacts.get(factname); }
  setFact(factname:factName,state:any,importance:factImportance=1,whoKnows:UniqueCharacter[]){
    let fact = this.knownFacts.get(factname);
    if(fact)return fact.state = state;
    fact = new Fact(state,importance);
    this.knownFacts.set(factname,fact);
    this.createSubscriptions();
    for(const character of whoKnows){
      if(!this.characterMap.get(character.type))this.initializeCharacter(character);
      this.characterMap.get(character.type)?.knownFacts.add(factname);
    }
  }
  registerCharacterLink(character1:UniqueCharacter,character2:UniqueCharacter,acquaintace:acquaintaceness){
    this.registerDirectionalCharacterLink(character1,character2,acquaintace)
    this.registerDirectionalCharacterLink(character2,character1,acquaintace)
  }
  registerDirectionalCharacterLink(character1:UniqueCharacter,character2:UniqueCharacter,acquaintace:acquaintaceness){
    if(character1===character2)return;
    if(!this.characterMap.get(character1.type))this.initializeCharacter(character1);
    if(!this.characterMap.get(character2.type))this.initializeCharacter(character2);
    this.characterMap.get(character1.type)?.acquaintacerMap.set(character2.type,acquaintace);
  }
  spreadFact(time:Time):void{
    let surroundingCharactersKnowTheSameThings = true;
    if(this.lastSpreadTime < time.getMinutes() - FactWeb.TIME_INTERVAL_2_SPREAD)return;
    this.lastSpreadTime=floorTo(time.getMinutes(),FactWeb.TIME_INTERVAL_2_SPREAD);
    const markForSpread:(()=>void)[]=[]
    for(const [,{knownFacts:facts,acquaintacerMap:acquaintaces}] of this.characterMap)
    for(const [acquaintace,closeness] of acquaintaces){
      const acquaintaceFacts = this.characterMap.get(acquaintace)?.knownFacts;
      if( !acquaintaceFacts ){ continue; }
      surroundingCharactersKnowTheSameThings &&= setEquality(facts,acquaintaceFacts);
      // no need to spread if both know the same facts
      if(surroundingCharactersKnowTheSameThings)continue;
      for(const factname of facts ){
        const fact = this.knownFacts.get(factname);
        if(!fact || acquaintaceFacts.has(factname)){continue;}
        if(randomCheck(FactWeb.SPREAD_COEFFICIENT*fact.importance*closeness))
        // only mark for spread, prevent spread the same fact in the same iteration
        markForSpread.push(()=>{acquaintaceFacts.add(factname)});
      }
    }
    for(const spreadFunction of markForSpread)spreadFunction();
    if(surroundingCharactersKnowTheSameThings) this.removeSubscriptions();
  }
  private removeSubscriptions(): void {
    if(this.spreadSubscriptions)this.spreadSubscriptions.unsubscribe();
    this.spreadSubscriptions=null;
  }
  toJson(): DataWebStoreable {
    const knownFacts:[name:factName,fact:FactStoreable][] = []
    const acquaintaceGraph:Set<string> = new Set();
    const knownFactsPerCharacter:[characterId:string,facts:factName[]][]=[];
    // Store Facts
    for(const [name,fact] of this.knownFacts.entries()) { knownFacts.push([name,fact.toJson()]) }
    for(const [character,{knownFacts:facts,acquaintacerMap:acquaintaces}] of this.characterMap){
      // Store relationships
      for(const [acquaintace,closeness] of acquaintaces){
        acquaintaceGraph.add(hashAcquanintace(character,acquaintace,closeness));
      }
      // Store fact known per character
      knownFactsPerCharacter.push([character,Array.from(facts)])
    }
    return{
      Factory: "FactWeb",
      type: "FactWeb",
      dependencyGamesaveObjectKey: [ "MainCharacter","PersistentCharacter"],
      knownFacts,
      lastSpreadTime:this.lastSpreadTime,
      acquaintaceGraph:Array.from(acquaintaceGraph),
      knownFactsPerCharacter
    }
  }
  fromJson(options: DataWebStoreable): void {
    // clear all
    this.knownFacts.clear();
    this.characterMap.clear();
    this.initializeCharacterMap();
    // Load Facts
    for(const [factname,factOptions] of options.knownFacts){
      const fact = new Fact('',0)
      fact.fromJson(factOptions)
      this.knownFacts.set(factname,fact)
    }
    // Load relationships
    for(const hashedRelationship of options.acquaintaceGraph){
      const [character1Id,character2Id,closeness] = unhashAcquaintance(hashedRelationship)
      this.registerDirectionalCharacterLink(
        this.uniqueCharacterHandler.getCharacter(character1Id),
        this.uniqueCharacterHandler.getCharacter(character2Id),
        closeness
      )
    }
    this.lastSpreadTime=options.lastSpreadTime;
    // Load fact known per character
    for(const [characterId,facts] of options.knownFactsPerCharacter){
      const characterDataWebData = this.characterMap.get( characterId );
      if(characterDataWebData)
        characterDataWebData.knownFacts=new Set(facts)
    }
  }
}
export const SetDataweb:FactoryFunction<void,DataWebStoreable> = (masterService, options) =>{
  masterService.FactWeb.fromJson(options);
}

type DataWebStoreable = {
  Factory: "FactWeb",
  type: "FactWeb",
  dependencyGamesaveObjectKey?: [ "MainCharacter","PersistentCharacter"],
  knownFacts:[name:factName,fact:FactStoreable][],
  acquaintaceGraph:string[],
  lastSpreadTime:number,
  knownFactsPerCharacter:[character_id:string,facts:factName[]][]
}

// tslint:disable-next-line: max-classes-per-file
class Fact implements Storeable{
  type:"Fact"="Fact";
  state:any;
  private _importance:factImportance;
  constructor(factstate:any, factimportance:factImportance){
    this.state = factstate;
    this._importance = factimportance;
  }
  get importance(){return this._importance;}
  toJson(): FactStoreable {
    return {
      Factory: "FactWeb",
      type: "Fact",
      state:this.state,
      importance:this._importance
    }
  }
  fromJson(options: FactStoreable): void {
    this.state = options.state
    this._importance = options.importance
  }
}

type FactStoreable = {
  Factory: "FactWeb",
  type: "Fact",
  dependencyGamesaveObjectKey?: gamesavenames[],
  state:any,
  importance:factImportance
}

const HASH_SEPARATOR = "<!¡>"
function hashAcquanintace(character1Id:string,character2Id:string,closeness:number):string
{ return [character1Id,character2Id,closeness].join(HASH_SEPARATOR) }
function unhashAcquaintance(hash: string):hashedAcquanitance{
  const unhash:[string,string,number] = hash.split(HASH_SEPARATOR) as any;
  unhash[2] = Number.parseInt(unhash[2].toString())
  return unhash;
}
