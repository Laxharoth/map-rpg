import { constructor, constructor_mapping, switcher, switcher_mapping } from "src/gameLogic/configurable/Factory/Register_Module/Register_Module_Variables";
import { removeItem } from "src/gameLogic/custom/functions/htmlHelper.functions";
import { Factory } from "../Factory";

const registered_modules_set = new Set<string>()
export type register_function = ( switcher:switcher_mapping,
                                  constructor:constructor_mapping,
                                  _Factory:typeof Factory)=>void;
export interface registerable{register:register_function,module_name:string,module_dependency:string[]}

const waiting_modules:registerable[] = []
export function add_module(module:registerable):void
{
  waiting_modules.push(module)
}
export function register_all_modules()
{
  let previous_waiting_modules_length = 0;
  while(previous_waiting_modules_length!==waiting_modules.length)
  {
    previous_waiting_modules_length = waiting_modules.length
    const remove_modules:registerable[] = []
    for(const module of waiting_modules)if(register_module(module))remove_modules.push(module)
    for(const module of remove_modules )removeItem(waiting_modules, module)
  }
  for(const module of waiting_modules)
  { console.warn(`Module ${module.module_name} could not be loaded because depends of "${module.module_dependency.join(",")}"`) }
}
function register_module({register,module_name,module_dependency}:registerable):boolean
{
  if(module_dependency.some(module=>!registered_modules_set.has(module)))return false;
  register(switcher,constructor,Factory);
  registered_modules_set.add(module_name)
  return true;
}
