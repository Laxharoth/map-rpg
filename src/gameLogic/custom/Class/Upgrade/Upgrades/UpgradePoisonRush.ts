import { MasterService } from 'src/app/service/master.service';
import { Upgrade } from './../Upgrade';
export class UpgradePoisonRush extends Upgrade{
  constructor(masterService:MasterService){
    super(masterService,'Poison Rush','get poison rush', 'PerkPoisonRush');
  }
}
