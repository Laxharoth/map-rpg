import { descriptable } from "../GameElementDescription/GameElementDescription";

/**
 * A Representation of what the game will displayed (text and options)
 *
 * @export
 * @interface Description
 * @constructor Initializes the text function and options.
 */
type fixed_option = DescriptionOptions|null
export interface Description
{
  descriptionData:() => any;
  options: DescriptionOptions[];
  fixed_options: [fixed_option,fixed_option,fixed_option,fixed_option,fixed_option];
}
export type descriptionData=() => any;
export type descriptionString=() => string;

/**
 * A representation of the options (buttons) for a description.
 *
 * @export
 * @interface DescriptionOptions
 */
export interface DescriptionOptions
{
  /**
   * The text to display
   *
   * @type {string}
   */
  text  : string;
  /**
   * The action to perform.
   *
   */
  action: () => void;
  /**
   * If the button is disabled.
   *
   */

  disabled: boolean
}

export interface DescriptableDescriptionOptions extends DescriptionOptions
{
  descriptable:descriptable;
}
