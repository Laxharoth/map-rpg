import { descriptable } from "../GameElementDescription/GameElementDescription";

/**
 * A Representation of what the game will displayed (text and options)
 *
 * @export
 * @class Description
 * @constructor Initializes the text function and options.
 */
type fixed_option = DescriptionOptions|null
export class Description
{
  descriptionData:() => any;
  options: DescriptionOptions[];
  fixed_options: [fixed_option,fixed_option,fixed_option,fixed_option,fixed_option] = [null, null, null, null, null];
  constructor(descriptionData:()=>any,options:DescriptionOptions[])
  {
    this.descriptionData = descriptionData;
    this.options = options;
  }
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
