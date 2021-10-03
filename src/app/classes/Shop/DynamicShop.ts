import { storeable } from 'src/app/customTypes/customTypes';
import { itemname } from 'src/app/customTypes/itemnames';
import { MasterService } from '../masterService';
import { Shop } from "./Shop";

export class DynamicShop extends Shop implements storeable{

  constructor(name:string,shopItemNames:itemname[],masterService: MasterService,shopPrices)
  {
    //itemas are added from json
    super(name,[],masterService,shopPrices)
  }
  // TODO save the shop inventary
  toJson(): { [key: string]: any; } {
    throw new Error('Method not implemented.');
  }
  //TODO load the shop inventary
  fromJson(options: { [key: string]: any; }): void {
    throw new Error('Method not implemented.');
  }

}
