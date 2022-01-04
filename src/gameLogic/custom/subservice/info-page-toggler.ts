import { Description, DescriptionOptions } from "../Class/Descriptions/Description";
import { DescriptionHandlerService } from "./description-handler";

export class InfoPageToggler{
  private description_handler:DescriptionHandlerService;
  private toggled=false;
  private info_description:Description;
  constructor(description_handler:DescriptionHandlerService)
  { this.description_handler = description_handler; }

  toggle()
  {
    this.toggled = !this.toggled;
    if(this.toggled)
    {
      if(!this.info_description){
        this.info_description = new Description(()=>null,[]);
        /** debug */ this.info_description.fixed_options[0]=new DescriptionOptions('return',()=>this.toggle())
      }
      this.description_handler.headDescription(this.info_description,'info').setDescription(false)
      return;
    }
    this.description_handler.nextDescription(false)
  }
}
