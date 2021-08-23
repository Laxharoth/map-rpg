import { MasterService } from "../masterService";

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

export function nextOption(masterService:MasterService):DescriptionOptions
{
  return new DescriptionOptions("Next",()=>{masterService.descriptionHandler.nextDescription()})
}
