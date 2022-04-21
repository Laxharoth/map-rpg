import { ModuleFunctions } from 'src/gameLogic/configurable/Factory/FactoryMap';
import { constructor, constructor_mapping, switcher, switcherMapping } from "src/gameLogic/configurable/Factory/Register_Module/Register_Module_Variables";
import { removeItem } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { Factory } from "../Factory";

const registeredModulesSet = new Set<string>()
export type FactoryForModules = typeof Factory & ModuleFunctions
export type registerFunction = ( switcher:switcherMapping, constructor:constructor_mapping, _Factory:FactoryForModules)=>void;
export interface registerable{register:registerFunction,moduleName:string,moduleDependency:string[]}

const waitingModules:registerable[] = []
export function addModule(module:registerable):void{
  waitingModules.push(module)
}
export function registerAllModules(){
  let previousWaitingModulesLength = 0;
  while(previousWaitingModulesLength!==waitingModules.length){
    previousWaitingModulesLength = waitingModules.length
    const removeModules:registerable[] = []
    for(const module of waitingModules)if(register_module(module))removeModules.push(module)
    for(const module of removeModules )removeItem(waitingModules, module)
  }
  for(const module of waitingModules){
    console.warn(`Module ${module.moduleName} could not be loaded because depends of "${module.moduleDependency.join(",")}"`)
  }
}
function register_module({register,moduleName: moduleName,moduleDependency: moduleDependency}:registerable):boolean{
  if(moduleDependency.some(module=>!registeredModulesSet.has(module)))return false;
  register(switcher,constructor,Factory as FactoryForModules);
  registeredModulesSet.add(moduleName)
  return true;
}
