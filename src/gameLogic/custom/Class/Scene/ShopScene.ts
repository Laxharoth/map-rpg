import { MasterService } from "src/app/service/master.service";
import { nextOption } from "src/gameLogic/custom/Class/Scene/CommonOptions";
import { Scene, SceneOptions } from "./Scene";
import { Shop } from "src/gameLogic/custom/Class/Shop/Shop";

export function SetShopScene(masterService:MasterService,shop:Shop):void
{
  const options:SceneOptions[] = getShopOptions();
  const description:Scene = {sceneData:()=>shop,options,fixed_options:[null,null,null,null,null]};

  masterService.sceneHandler
    .headScene(description,'shop')
    .setScene(false);

  function getShopOptions():SceneOptions[]{
    return [
      checkoutButton(),
      nextOption(masterService,"Cancel")
    ]
  };

  function checkoutButton():SceneOptions
  {
    const player = masterService.partyHandler.user;
    return {
      text:'Checkout',
      action:()=>{
        shop.CheckoutSale(player);
        masterService.sceneHandler.nextScene(false);
      },
      get disabled(){return shop.sale.total>player.gold || !shop.sale.saleActionHasBeenMade}
    }
  }
}
