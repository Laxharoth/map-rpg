import { Observable, Subject } from 'rxjs';
import { MasterService } from 'src/app/service/master.service';
import { gamesavenames } from 'src/gameLogic/configurable/subservice/game-saver.type';
import { Factory, storeable, StoreableType } from 'src/gameLogic/core/Factory/Factory';
import { removeItem } from 'src/gameLogic/custom/functions/htmlHelper.functions';

export class  GameSaver{
  private _persistent_game_instances: {[key: string]:any[]} = {};
  private masterService:MasterService;
  private change_persistent_instance:Subject<on_change_persistent_instance_event> = new Subject()
  constructor(masterService:MasterService){this.masterService=masterService;}
  save(savename: string){
    const savegame_map:{[key: string]:{[key: string]:any}[]} = {}
    for(const [key,persistent_game_instances] of Object.entries(this._persistent_game_instances)){
      savegame_map[key] = []
      for(const persistent_game_instance of persistent_game_instances)
        savegame_map[key].push(persistent_game_instance.toJson());
    }
    localStorage.setItem(savename,JSON.stringify(savegame_map));
  }
  load(savename: string){
    const gameInstances:{[key in gamesavenames]:StoreableType[]}|undefined = JSON.parse(localStorage.getItem(savename)||'{}');
    if(!gameInstances){
      console.error(`Could not load ${savename}`);
      return;
    }
    let waitingKeys:gamesavenames[] = []
    const initializeGameInstancesWithKey = (key: gamesavenames)=>{
      const persistent_game_instances = gameInstances[key]
      if(!persistent_game_instances)return;
      for (const persistent_game_instance of persistent_game_instances){
        //The required key has not been defined make it wait
        if(persistent_game_instance?.dependency_gamesave_object_key &&
          !persistent_game_instance.dependency_gamesave_object_key.every(key => this._persistent_game_instances[key])){
            waitingKeys.push(key); break;
        }
        //persistent objects should register themselves
        Factory(
          this.masterService,
          persistent_game_instance
        )
      }
    }
    //initialize game instances
    for(const key of Object.keys(gameInstances) as gamesavenames[]) {
      initializeGameInstancesWithKey(key)
    }
    //initialize game instances with requirements
    let workingWaitingKeys:gamesavenames[] = []
    while(waitingKeys.length){
      workingWaitingKeys = [...waitingKeys];
      waitingKeys = [];
      for(const key of workingWaitingKeys){
        initializeGameInstancesWithKey(key);
      }
      //if no key was removed from waitingKeys break
      if(workingWaitingKeys.length === waitingKeys.length){ break; }
    }
  }
  register(key: gamesavenames, storeable: storeable) {
    if (!this._persistent_game_instances[key]) {
      this._persistent_game_instances[key] = []
      Object.defineProperty(this,key,{get: ()=>this._persistent_game_instances[key]})
    }
    this._persistent_game_instances[key].push(storeable)
    this.change_persistent_instance.next([key,"register",storeable])
  }
  unregister(key: gamesavenames,storeable: storeable){
    removeItem(this._persistent_game_instances[key],storeable)
    this.change_persistent_instance.next([key,"unregister",storeable])
  }

  on_change_persistent_instance():Observable<on_change_persistent_instance_event>{
    return this.change_persistent_instance.asObservable();
  }
}
export type on_change_persistent_instance_event = [instance_name:gamesavenames,action:"register"|"unregister",instance:storeable]
