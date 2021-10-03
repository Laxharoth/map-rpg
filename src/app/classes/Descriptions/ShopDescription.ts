import { nextOption } from 'src/app/classes/Descriptions/CommonOptions';
import { MasterService } from '../masterService';
import { Shop } from "../Shop/Shop";
import { Description, DescriptionOptions } from "./Description";

//TODO add DescriptionOptions to End Sale
export function SetShopDescription(masterService:MasterService,shop:Shop):void
{
  const options:DescriptionOptions[] = getShopOptions();
  const description = new Description(()=>shop,options);

  masterService.descriptionHandler
    .headDescription(description,'shop')
    .setDescription(false);

  function getShopOptions():DescriptionOptions[]{
    return [
      nextOption(masterService)
    ]
  };
}
