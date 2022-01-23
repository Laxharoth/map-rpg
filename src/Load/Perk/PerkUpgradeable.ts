import { MasterService } from 'src/app/service/master.service';
import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { PerkStoreable } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";

const register: register_function = ({perk}, {perk:{Perk}}, Factory) => {
  class PerkUpgradeable extends Perk {
    level:number;
    constructor(masterService:MasterService)
    {
      super(masterService);
      this.level=0;
    }
    readonly type: "PerkUpgradeable"="PerkUpgradeable";
    get name(): string {
      return "Perk Upgrade";
    }
    toJson():PerkStoreable {
      const storeable = super.toJson();
      storeable.level = this.level;
      return storeable;
    }
    fromJson(json:PerkStoreable){
      super.fromJson(json);
      json.level&&(this.level=json.level);
    }
  }
  perk["PerkUpgradeable"]=PerkUpgradeable
}
const module_name = "PerkUpgradeable"
const module_dependency = []
export { register, module_name, module_dependency}
