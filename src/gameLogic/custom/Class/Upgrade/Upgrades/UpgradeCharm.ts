import { MasterService } from 'src/app/service/master.service';
import { Upgrade } from './../Upgrade';
export class UpgradeCharm extends Upgrade{
  constructor(masterService:MasterService){
    super(masterService,'Charm','get charm', 'PerkCharm');
  }
}
