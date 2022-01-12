import { Subscription } from 'rxjs';
import { UniqueCharacter } from "src/gameLogic/custom/Class/Character/UniqueCharacter";
import { FactoryFunction } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { floor_to, randomCheck, set_equality } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { Time } from './../ClassHelper/Time';
import { acquaintaceness, factName, CharacterDataWebData, hashed_acquanitance, fact_importance } from './fact-web.type';
import { TimeHandler } from './time-handler';
import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { MasterService } from 'src/app/service/master.service';
import { gamesavenames, GameSaverMap } from 'src/gameLogic/configurable/subservice/game-saver.type';
import { UniqueCharacterHandler } from './unique-character-handler';

export class FactWeb implements storeable
{
  static readonly TIME_INTERVAL_2_SPREAD = 1440;
  private static readonly SPREAD_COEFFICIENT = 20;
  private last_spread_time = 0;
  private unique_character_handler:UniqueCharacterHandler;
  private known_facts:Map<factName,Fact> = new Map();
  private character_map:Map<string,CharacterDataWebData> = new Map();
  private spread_subscriptions:Subscription;
  private create_subscriptions:()=>void

  /**
   * Stores a group of facts, then spreads them through a graph of characters.
   * @param time_handler Creates a subscription to spread facts every set amount of time.
   * @param game_saver Required to get the characters from the unique characters.
   */
  constructor(time_handler:TimeHandler, game_saver:GameSaver,unique_character_handler:UniqueCharacterHandler){
    game_saver.register("FactWeb",this);
    this.unique_character_handler = unique_character_handler;
    this.create_subscriptions = ()=>{
      if(!this.spread_subscriptions)this.spread_subscriptions = time_handler.onTimeChanged().subscribe( time => this.spread_fact(time) )
    }
  }

  private initialize_character_map()
  {
    for(const character of this.unique_character_handler.unique_characters)
      this.initialize_character(character);
  }

  private initialize_character(character: UniqueCharacter) {
    this.character_map.set(character.uuid, {
      known_facts: new Set(),
      acquaintacer_map: new Map(),
    });
  }

  get_fact(fact_name:factName){ return this.known_facts.get(fact_name); }
  set_fact(fact_name:factName,state:any,importance:fact_importance=1,who_knows:UniqueCharacter[])
  {
    let fact = this.known_facts.get(fact_name);
    if(fact)return fact.state = state;
    fact = new Fact(state,importance);
    this.known_facts.set(fact_name,fact);
    this.create_subscriptions();
    for(const character of who_knows)
    {
      if(!this.character_map.get(character.uuid))this.initialize_character(character);
      this.character_map.get(character.uuid).known_facts.add(fact_name);
    }
  }
  register_character_link(character1:UniqueCharacter,character2:UniqueCharacter,acquaintace:acquaintaceness)
  {
    this.register_directional_character_link(character1,character2,acquaintace)
    this.register_directional_character_link(character2,character1,acquaintace)
  }
  register_directional_character_link(character1:UniqueCharacter,character2:UniqueCharacter,acquaintace:acquaintaceness)
  {
    if(character1===character2)return;
    if(!this.character_map.get(character1.uuid))this.initialize_character(character1);
    if(!this.character_map.get(character2.uuid))this.initialize_character(character2);
    this.character_map.get(character1.uuid).acquaintacer_map.set(character2.uuid,acquaintace);
  }
  spread_fact(time:Time):void
  {
    let surrounding_characters_know_the_same_things = true;
    if(this.last_spread_time < time.getMinutes() - FactWeb.TIME_INTERVAL_2_SPREAD)return;
    this.last_spread_time=floor_to(time.getMinutes(),FactWeb.TIME_INTERVAL_2_SPREAD);
    const mark_for_spread:(()=>void)[]=[]
    for(const [,{known_facts:facts,acquaintacer_map:acquaintaces}] of this.character_map)
    for(const [acquaintace,closeness] of acquaintaces)
    {
      const acquaintace_facts = this.character_map.get(acquaintace).known_facts;
      surrounding_characters_know_the_same_things &&= set_equality(facts,acquaintace_facts);
      //no need to spread if both know the same facts
      if(surrounding_characters_know_the_same_things)continue;
      for(const fact_name of facts )
      {
        if(acquaintace_facts.has(fact_name))continue;
        const fact = this.known_facts.get(fact_name);
        if(randomCheck(FactWeb.SPREAD_COEFFICIENT*fact.importance*closeness))
        //only mark for spread, prevent spread the same fact in the same iteration
        mark_for_spread.push(()=>{acquaintace_facts.add(fact_name)});
      }
    }
    for(const spread_function of mark_for_spread)spread_function();
    if(surrounding_characters_know_the_same_things) this.remove_subscriptions();
  }
  private remove_subscriptions(): void {
    if(this.spread_subscriptions)this.spread_subscriptions.unsubscribe();
    this.spread_subscriptions=null;
  }
  toJson(): DataWebStoreable {
    const known_facts:[name:factName,fact:FactStoreable][] = []
    const acquaintace_graph:Set<string> = new Set();
    const known_facts_per_character:[character_id:string,facts:factName[]][]=[];
    //Store Facts
    for(const [name,fact] of this.known_facts.entries()) { known_facts.push([name,fact.toJson()]) }
    for(const [character,{known_facts:facts,acquaintacer_map:acquaintaces}] of this.character_map)
    {
      //Store relationships
      for(const [acquaintace,closeness] of acquaintaces)
      {
        acquaintace_graph.add(hash_acquanintace(character,acquaintace,closeness));
      }
      //Store fact known per character
      known_facts_per_character.push([character,Array.from(facts)])
    }
    return{
      Factory: "FactWeb",
      type: "FactWeb",
      dependency_gamesave_object_key: [ "MainCharacter","PersistentCharacter"],
      known_facts:known_facts,
      acquaintace_graph:Array.from(acquaintace_graph),
      known_facts_per_character:known_facts_per_character
    }
  }
  fromJson(options: DataWebStoreable): void {
    //clear all
    this.known_facts.clear();
    this.character_map.clear();
    this.initialize_character_map();
    //Load Facts
    for(const [factname,fact_options] of options.known_facts)
    {
      const fact = new Fact('',0)
      fact.fromJson(fact_options)
      this.known_facts.set(factname,fact)
    }
    //Load relationships
    for(const hashed_relationship of options.acquaintace_graph)
    {
      const [character1_id,character2_id,closeness] = unhash_acquaintance(hashed_relationship)
      this.register_directional_character_link(
        this.unique_character_handler.get_character(character1_id),
        this.unique_character_handler.get_character(character2_id),
        closeness
      )
    }
    //Load fact known per character
    for(const [character_id,facts] of options.known_facts_per_character)
    {
      this.character_map.get( character_id ).known_facts=new Set(facts)
    }
  }
}
export const SetDataweb:FactoryFunction = (masterService:MasterService, options:DataWebStoreable) =>{
  masterService.FactWeb.fromJson(options);
}

type DataWebStoreable = {
  Factory: "FactWeb",
  type: "FactWeb",
  dependency_gamesave_object_key?: [ "MainCharacter","PersistentCharacter"],
  known_facts:[name:factName,fact:FactStoreable][],
  acquaintace_graph:string[],
  known_facts_per_character:[character_id:string,facts:factName[]][]
}

class Fact implements storeable
{
  state:any;
  private _importance:fact_importance;
  constructor(fact_state:any, fact_importance:fact_importance){
    this.state = fact_state;
    this._importance = fact_importance;
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
  dependency_gamesave_object_key?: gamesavenames[],
  state:any,
  importance:fact_importance
}

const HASH_SEPARATOR = "<!¡>"
function hash_acquanintace(character1_id:string,character2_id:string,closeness:number):string
{ return [character1_id,character2_id,closeness].join(HASH_SEPARATOR) }
function unhash_acquaintance(hash: string):hashed_acquanitance
{
  const unhash:[string,string,number] = hash.split(HASH_SEPARATOR) as any;
  unhash[2] = Number.parseInt(unhash[2].toString())
  return unhash;
}
