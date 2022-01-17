import { removeItem } from 'src/gameLogic/custom/functions/htmlHelper.functions';
import { MasterService } from "src/app/service/master.service";
import { factoryMap, factoryname } from "src/gameLogic/configurable/Factory/FactoryMap";
import { gamesavenames } from "src/gameLogic/configurable/subservice/game-saver.type";

export function Factory(masterService:MasterService,options:{[key: string]:any})
{ return factoryMap[options.Factory](masterService,options) }

export type StoreableType = {Factory:factoryname,type: string,dependency_gamesave_object_key?:gamesavenames[],[key: string]:any};
export interface storeable {
  toJson():StoreableType;
  fromJson(options:StoreableType):void;
}

const registered_modules_set = new Set<string>(["Poison"])
type register_object = {register_function:()=>void,module_name:string,module_dependency:string[]}
const waiting_modules:register_object[] = []
export function add_module(module:register_object):void
{
  let previous_waiting_modules_length = waiting_modules.length
  waiting_modules.push(module)
  while(previous_waiting_modules_length!==waiting_modules.length)
  {
    previous_waiting_modules_length = waiting_modules.length
    const remove_modules:register_object[] = []
    for(const module of waiting_modules)if(register_module(module))remove_modules.push(module)
    for(const module of remove_modules )removeItem(waiting_modules, module)
  }
}
export function register_module({register_function,module_name,module_dependency}:register_object):boolean
{
  if(module_dependency.some(module=>!registered_modules_set.has(module)))return false;
  register_function();
  registered_modules_set.add(module_name)
  return true;
}
