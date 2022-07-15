import { Descriptable } from "../GameElementDescription/GameElementDescription";

/**
 * A Representation of what the game will displayed (text and options)
 */
export interface Scene{
  sceneData:() => any;
  options: SceneOptions[];
  fixedOptions?: FixedOptions;
}
export type sceneData=() => any;

/** A representation of the options (buttons) for a description. */
export interface SceneOptions{
  /** The text to display */
  text  : string;
  /** The action to perform. */
  action: () => void;
  /** If the button is disabled. */
  disabled: boolean
}
export function runWrappedAction(sceneOptions:SceneOptions){
  if(sceneOptions.disabled){return;}
  sceneOptions.action();
}
export function wrapAction(option:SceneOptions|null):SceneOptions|null{
  const optionWrapped = option as (SceneOptions & {_action?:()=>void;})|(SceneOptions & {_action:()=>void;})|null;
  if(!optionWrapped || optionWrapped._action){ return null; }
  optionWrapped._action = optionWrapped.action;
  optionWrapped.action = function(){
    if(!this.disabled)
    this._action?.();
  }
  return optionWrapped;
}
export interface DescriptableSceneOptions extends SceneOptions{
  descriptable:Descriptable;
}
type fixedOption = SceneOptions|null
export type FixedOptions = [fixedOption,fixedOption,fixedOption,fixedOption,fixedOption];
