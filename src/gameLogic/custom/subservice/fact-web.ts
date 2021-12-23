import { Subscription } from 'rxjs';
import { UniqueCharacter } from 'src/gameLogic/custom/Class/Character/Character';
import { FactoryFunction } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { floor_to, randomCheck } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { Time } from './../ClassHelper/Time';
import { acquaintaceness, factName, fact_importance, CharacterDataWebData } from './fact-web.type';
import { TimeHandler } from './time-handler';
import { storeable } from 'src/gameLogic/core/Factory/Factory';
import { GameSaver } from 'src/gameLogic/core/subservice/game-saver';
import { MasterService } from 'src/app/service/master.service';
import { gamesavenames, GameSaverMap } from 'src/gameLogic/configurable/subservice/game-saver.type';

export class FactWeb implements storeable
{
  static readonly TIME_INTERVAL_2_SPREAD = 1440;
  private static readonly SPREAD_COEFFICIENT = 20;
  private static readonly HASH_SEPARATOR = "<!¡>"
  private last_spread_time = 0;
  private game_saver:GameSaver&GameSaverMap;
  private known_facts:Map<factName,Fact> = new Map();
  private character_map:Map<string,CharacterDataWebData> = new Map();
  private spread_subscriptions:Subscription;
  private create_subscriptions:()=>void

  /**
   * Stores a group of facts, then spreads them through a graph of characters.
   * @param time_handler Creates a subscription to spread facts every set amount of time.
   * @param game_saver Required to get the characters from the unique characters.
   */
  constructor(time_handler:TimeHandler, game_saver:GameSaver){
    game_saver.register("FactWeb",this);
    this.game_saver = game_saver as GameSaver&GameSaverMap;
    this.initialize_character_map();
    this.create_subscriptions = ()=>{
      if(!this.spread_subscriptions)this.spread_subscriptions = time_handler.onTimeChanged().subscribe( time => this.spread_fact(time) )
    }
  }

  private initialize_character_map()
  {
    for (const character of this.game_saver.MainCharacter?.concat(this.game_saver?.PersistentCharacter) as UniqueCharacter[])
    {
      this.character_map.set(character.uuid, {
        known_facts: new Set(),
        acquaintacer_map: new Map(),
      });
    }
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
      this.character_map.get(character.uuid).known_facts.add(fact_name);
  }
  register_character_link(character1:UniqueCharacter,character2:UniqueCharacter,acquaintace:acquaintaceness)
  {
    if(character1===character2)return;
    this.character_map.get(character1.uuid).acquaintacer_map.set(character2.uuid,acquaintace);
    this.character_map.get(character2.uuid).acquaintacer_map.set(character1.uuid,acquaintace);
  }
  spread_fact(time:Time):void
  {
    if(this.last_spread_time < time.getMinutes() - FactWeb.TIME_INTERVAL_2_SPREAD)return;
    this.last_spread_time=floor_to(time.getMinutes(),FactWeb.TIME_INTERVAL_2_SPREAD);
    const MAX_FACTS_KNOWN = this.known_facts.size;
    //the number of facts known by the character who knows the least number of facts.
    let min_facts_known = MAX_FACTS_KNOWN
    const mark_for_spread:(()=>void)[]=[]
    for(const [,{known_facts:facts,acquaintacer_map:acquaintaces}] of this.character_map)
    for(const [acquaintace,closeness] of acquaintaces)
    {
      const acquaintace_facts = this.character_map.get(acquaintace).known_facts;
      min_facts_known = Math.min(min_facts_known,acquaintace_facts.size)
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
    //if MAX_FACTS_KNOWN === min_facts_known everyone knows everything, there is no need to spread anymore.
    if(MAX_FACTS_KNOWN === min_facts_known) this.remove_subscriptions();
  }
  private remove_subscriptions(): void {
    if(this.spread_subscriptions)this.spread_subscriptions.unsubscribe();
    this.spread_subscriptions=null;
  }
  static hash_acquanintace(character1_id:string,character2_id:string,closeness:number):string
  {
    const sorded_ids:any[] = [character1_id,character2_id].sort((id1,id2)=>id1<id2?-1:1)
    return sorded_ids.concat([closeness]).join(FactWeb.HASH_SEPARATOR)
  }
  static unhash_acquaintance(hash: string):[character1_id:string, character2_id:string,closeness:number] {
    const unhash:[string,string,number] = hash.split(FactWeb.HASH_SEPARATOR) as any;
    unhash[2] = Number.parseInt(unhash[2].toString())
    return unhash;
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
        acquaintace_graph.add(FactWeb.hash_acquanintace(character,acquaintace,closeness));
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
    this.initialize_character_map();
    const unique_characters = this.game_saver.MainCharacter.concat(this.game_saver.PersistentCharacter) as UniqueCharacter[]
    //Load Facts
    this.known_facts.clear();
    for(const [factname,fact_options] of options.known_facts)
    {
      const fact = new Fact('',0)
      fact.fromJson(fact_options)
      this.known_facts.set(factname,fact)
    }
    //Clear character map
    this.character_map.clear();
    //Load relationships
    for(const hashed_relationship of options.acquaintace_graph)
    {
      const [character1_id,character2_id,closeness] = FactWeb.unhash_acquaintance(hashed_relationship)
      this.register_character_link(
        unique_characters.find(character=>character.uuid === character1_id),
        unique_characters.find(character=>character.uuid === character2_id),
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
  masterService.DataWeb.fromJson(options);
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
