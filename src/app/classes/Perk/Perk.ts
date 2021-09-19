import { storeable } from "src/app/customTypes/customTypes";
import { perkname } from "src/app/customTypes/perkname";
import { tag } from "src/app/customTypes/tags";
import { Reaction } from "../Character/Reaction/Reaction";
import { SpecialAttack } from "../Items/SpecialAttack/SpecialAttack";
import { MasterService } from "../masterService";

export abstract class Perk implements storeable
{
  abstract get name():perkname;
  protected readonly masterService:MasterService;
  constructor(masterService:MasterService)
  { this.masterService = masterService; }

  get tags(): tag[] { return []; }
  get reactions(): Reaction[]{ return []}
  get specials():SpecialAttack[] { return []}

  toJson():{[key: string]:any} { return {}; }
  fromJson(options:{[key: string]: any}):void { }
}
