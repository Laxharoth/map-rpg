import { nextOption } from 'src/app/classes/Descriptions/CommonOptions';
import { MasterService } from "src/app/service/master.service";
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
      checkoutButton(),
      nextOption(masterService)
    ]
  };

  function checkoutButton():DescriptionOptions
  {
    const player = masterService.partyHandler.user;
    return new DescriptionOptions('Checkout',()=>{
      shop.CheckoutSale(player);
      masterService.descriptionHandler.nextDescription(false);
    },()=> shop.sale.total>player.gold || !shop.sale.saleActionHasBeenMade )
  }
}
