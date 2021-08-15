import { DescriptionHandlerService } from "../service/description-handler.service";
import { FlagHandlerService } from "../service/flag-handler.service";
import { MapHandlerService } from '../service/map-handler.service';

export class Description
{
  text:() => string;
  options: DescriptionOptions[];

  constructor(text:()=>string,options:DescriptionOptions[])
  {
    this.text = text;
    this.options = options;
  }
}

export class DescriptionOptions
{
  text  : string;
  action: () => void;
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
