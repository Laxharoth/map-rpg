import { MasterService } from 'src/app/service/master.service';
import { Upgrade } from './../Upgrade';
export class UpgradeGrappler extends Upgrade{
  constructor(masterService:MasterService){
    super(masterService,'Grappler','get grab command', 'Grappler');
  }
}
