import { MasterService } from "src/app/service/master.service";
import { nextOption } from "src/gameLogic/custom/Class/Descriptions/CommonOptions";
import { Description, DescriptionOptions } from "src/gameLogic/custom/Class/Descriptions/Description";
import { Shop } from "src/gameLogic/custom/Class/Shop/Shop";

export function SetShopDescription(masterService:MasterService,shop:Shop):void
{
  const options:DescriptionOptions[] = getShopOptions();
  const description:Description = {descriptionData:()=>shop,options,fixed_options:[null,null,null,null,null]};

  masterService.descriptionHandler
    .headDescription(description,'shop')
    .setDescription(false);

  function getShopOptions():DescriptionOptions[]{
    return [
      checkoutButton(),
      nextOption(masterService,"Cancel")
    ]
  };

  function checkoutButton():DescriptionOptions
  {
    const player = masterService.partyHandler.user;
    return {
      text:'Checkout',
      action:()=>{
        shop.CheckoutSale(player);
        masterService.descriptionHandler.nextDescription(false);
      },
      get disabled(){return shop.sale.total>player.gold || !shop.sale.saleActionHasBeenMade}
    }
  }
}
