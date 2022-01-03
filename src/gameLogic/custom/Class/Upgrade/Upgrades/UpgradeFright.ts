import { MasterService } from 'src/app/service/master.service';
import { Upgrade } from './../Upgrade';
export class UpgradeFright extends Upgrade
{
  constructor(masterService:MasterService)
  {
    super(masterService,'Fright','get Fright', 'Frighter');
  }
}
