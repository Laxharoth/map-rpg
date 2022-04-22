import { Observable, Subject } from 'rxjs';
import { MasterService } from 'src/app/service/master.service';
import { gamesavenames } from 'src/gameLogic/configurable/subservice/game-saver.type';
import { Factory, Storeable, StoreableType } from 'src/gameLogic/core/Factory/Factory';
import { removeItem } from 'src/gameLogic/custom/functions/htmlHelper.functions';

export class  GameSaver{
  private _persistentGameInstances: {[key: string]:any[]} = {};
  private masterService:MasterService;
  private changePersistentInstance:Subject<onChangePersistentInstanceEvent> = new Subject()
  constructor(masterService:MasterService){this.masterService=masterService;}
  save(savename: string){
    const savegameMap:{[key: string]:{[key: string]:any}[]} = {}
    for(const [key,persistentGameInstances] of Object.entries(this._persistentGameInstances)){
      savegameMap[key] = []
      for(const persistentGameInstance of persistentGameInstances)
        savegameMap[key].push(persistentGameInstance.toJson());
    }
    localStorage.setItem(savename,JSON.stringify(savegameMap));
  }
  load(savename: string){
    const gameInstances:{[key in gamesavenames]:StoreableType[]}|undefined = JSON.parse(localStorage.getItem(savename)||'{}');
    if(!gameInstances){
      console.error(`Could not load ${savename}`);
      return;
    }
    let waitingKeys:gamesavenames[] = []
    const initializeGameInstancesWithKey = (key: gamesavenames)=>{
      const persistentGameInstances = gameInstances[key]
      if(!persistentGameInstances)return;
      for (const persistentGameInstance of persistentGameInstances){
        // The required key has not been defined make it wait
        if(persistentGameInstance?.dependencyGamesaveObjectKey &&
          !persistentGameInstance.dependencyGamesaveObjectKey.every(instanceKey => this._persistentGameInstances[key])){
            waitingKeys.push(key); break;
        }
        // persistent objects should register themselves
        Factory(
          this.masterService,
          persistentGameInstance
        )
      }
    }
    // initialize game instances
    for(const key of Object.keys(gameInstances) as gamesavenames[]) {
      initializeGameInstancesWithKey(key)
    }
    // initialize game instances with requirements
    let workingWaitingKeys:gamesavenames[] = []
    while(waitingKeys.length){
      workingWaitingKeys = [...waitingKeys];
      waitingKeys = [];
      for(const key of workingWaitingKeys){
        initializeGameInstancesWithKey(key);
      }
      // if no key was removed from waitingKeys break
      if(workingWaitingKeys.length === waitingKeys.length){ break; }
    }
  }
  register(key: gamesavenames, storeable: Storeable) {
    if (!this._persistentGameInstances[key]) {
      this._persistentGameInstances[key] = []
      Object.defineProperty(this,key,{get: ()=>this._persistentGameInstances[key]})
    }
    this._persistentGameInstances[key].push(storeable)
    this.changePersistentInstance.next([key,"register",storeable])
  }
  unregister(key: gamesavenames,storeable: Storeable){
    removeItem(this._persistentGameInstances[key],storeable)
    this.changePersistentInstance.next([key,"unregister",storeable])
  }

  on_change_persistent_instance():Observable<onChangePersistentInstanceEvent>{
    return this.changePersistentInstance.asObservable();
  }
}
export type onChangePersistentInstanceEvent = [
  instance_name:gamesavenames,
  action:"register"|"unregister",
  instance:Storeable
]
