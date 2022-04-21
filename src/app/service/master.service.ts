import { Injectable } from '@angular/core';
import { MasterServiceSubServiceMap } from 'src/gameLogic/configurable/subservice/MasterServiceSubServiceMap';

@Injectable({
  providedIn: 'root'
})

/**
 * A object to pack all services
 */
export class MasterService extends MasterServiceSubServiceMap{
  register(name:string,service:any){
    Object.defineProperty(this,name,{get:function(){return service;}});
  }
}
