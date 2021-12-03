import { Perk, PerkStoreable } from "src/gameLogic/custom/Class/Perk/Perk";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";

export class PerkUpgradeable extends Perk {
  level = 0;
  get name(): perkname {
    return "Perk Upgrade";
  }
  toJson():PerkStoreable {
    const storeable = super.toJson();
    storeable.level = this.level;
    return storeable;
  }
  fromJson(json:PerkStoreable){
    super.fromJson(json);
    this.level = json.level;
  }
}
