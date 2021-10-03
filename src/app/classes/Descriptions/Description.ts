import { MasterService } from "../masterService";

/**
 * A Representation of what the game will displayed (text and options)
 *
 * @export
 * @class Description
 * @constructor Initializes the text function and options.
 */
export class Description
{
  descriptionData:() => any;
  options: DescriptionOptions[];

  constructor(descriptionData:()=>any,options:DescriptionOptions[])
  {
    this.descriptionData = descriptionData;
    this.options = options;
  }
}

/**
 * A representation of the options (buttons) for a description.
 *
 * @export
 * @class DescriptionOptions
 * @constructor Initialized the text shown, the action to perform and if is disabled.
 */
export class DescriptionOptions
{
  /**
   * The text to display
   *
   * @type {string}
   * @memberof DescriptionOptions
   */
  text  : string;
  /**
   * The action to perform.
   *
   * @memberof DescriptionOptions
   */
  action: () => void;
  /**
   * If the button is disabled.
   *
   * @private
   * @memberof DescriptionOptions
   */
  private _disabled: () => boolean;
  constructor(text  : string,
              action: () => void,
              disabled: boolean|(() => boolean) = false)
  {
    this.text = text;
    this.action = action;
    this.disabled = disabled;
  }

  set disabled(val: boolean|(() => boolean))
  {
    if(typeof val === 'boolean')
    {
      this._disabled = () =>val;
      return;
    }
    this._disabled = val;
  }

  get disabled():boolean
  {
    return this._disabled();
  }
}
