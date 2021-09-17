import { perkname } from "src/app/customTypes/perkname";
import { Perk } from "./Perk";

export class PerkUpgradeable extends Perk {
  level = 0;
  get name(): perkname {
    return "Perk Upgrade";
  }
  toJson():{[key: string]:any} { return {level:this.level}}
  fromJson(json:{[key: string]: any}){this.level = json.level;}
}
