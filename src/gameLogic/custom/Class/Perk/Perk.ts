import { MasterService } from "src/app/service/master.service";
import { storeable } from "src/gameLogic/core/Factory/Factory";
import { Reaction } from "src/gameLogic/custom/Class/Character/Reaction/Reaction";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";
import { hashable } from "../../ClassHelper/ObjectSet";

/**
 * A object that represents a perk.
 * Something like a status but without effect.
 */
export abstract class Perk implements storeable, hashable
{
  abstract get name():string;
  abstract type:perkname;
  protected readonly masterService:MasterService;
  constructor(masterService:MasterService)
  { this.masterService = masterService; }
  /** The tags associated with the perk. */
  get tags(): tag[] { return []; }
  /** The reactions the prek grants. */
  get reactions(): Reaction[]{ return []}
  /** The special attacks the prek grants. */
  get specials():SpecialAttack[] { return []}
  hash(): string { return this.name }
  toJson():PerkStoreable { return {Factory:"Perk",type:this.type}; }
  fromJson(options:PerkStoreable):void { }
}

export type PerkStoreable = {
  Factory:"Perk";
  type:perkname;
  [key:string]:any;
}
