import { MasterService } from "src/app/service/master.service";
import { storeable } from "src/gameLogic/core/Factory/Factory";
import { Reaction } from "src/gameLogic/custom/Class/Character/Reaction/Reaction";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { perkname } from "src/gameLogic/custom/Class/Perk/Perk.type";
import { tag } from "src/gameLogic/custom/customTypes/tags";

/**
 * A object that represents a perk.
 * Something like a status but without effect.
 *
 * @export
 * @abstract
 * @class Perk
 * @implements {storeable}
 */
export abstract class Perk implements storeable
{
  /**
   * Can only use pername
   *
   * @readonly
   * @abstract
   * @type {perkname}
   * @memberof Perk
   */
  abstract get name():perkname;
  protected readonly masterService:MasterService;
  constructor(masterService:MasterService)
  { this.masterService = masterService; }

  /**
   * The tags associated with the perk.
   *
   * @readonly
   * @type {tag[]}
   * @memberof Perk
   */
  get tags(): tag[] { return []; }
  /**
   * The reactions the prek grants.
   *
   * @readonly
   * @type {Reaction[]}
   * @memberof Perk
   */
  get reactions(): Reaction[]{ return []}
  /**
   * The special attacks the prek grants.
   *
   * @readonly
   * @type {SpecialAttack[]}
   * @memberof Perk
   */
  get specials():SpecialAttack[] { return []}

  toJson():PerkStoreable { return {Factory:"Perk",type:this.name}; }
  fromJson(options:PerkStoreable):void { }
}

export type PerkStoreable = {
  Factory:"Perk";
  type:perkname;
  [key:string]:any;
}
