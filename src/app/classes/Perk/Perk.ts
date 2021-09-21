import { storeable } from "src/app/customTypes/customTypes";
import { perkname } from "src/app/customTypes/perkname";
import { tag } from "src/app/customTypes/tags";
import { Reaction } from "../Character/Reaction/Reaction";
import { SpecialAttack } from "../Items/SpecialAttack/SpecialAttack";
import { MasterService } from "../masterService";

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

  toJson():{[key: string]:any} { return {}; }
  fromJson(options:{[key: string]: any}):void { }
}
