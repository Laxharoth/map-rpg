import { descriptable } from "../GameElementDescription/GameElementDescription";

/**
 * A Representation of what the game will displayed (text and options)
 *
 * @export
 * @interface Scene
 * @constructor Initializes the text function and options.
 */
export interface Scene
{
  sceneData:() => any;
  options: SceneOptions[];
  fixed_options?: FixedOptions;
}
export type sceneData=() => any;
export type descriptionString=() => string;

/** A representation of the options (buttons) for a description. */
export interface SceneOptions
{
  /** The text to display */
  text  : string;
  /** The action to perform. */
  action: () => void;
  /** If the button is disabled. */
  disabled: boolean
}

export interface DescriptableSceneOptions extends SceneOptions
{
  descriptable:descriptable;
}
type fixed_option = SceneOptions|null
export type FixedOptions = [fixed_option,fixed_option,fixed_option,fixed_option,fixed_option];
