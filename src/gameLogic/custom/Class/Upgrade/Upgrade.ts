import { MasterService } from "src/app/service/master.service";
import { PerkFactory } from "../../Factory/PerkFactory";
import { descriptable, GameElementDescriptionSection } from "../GameElementDescription/GameElementDescription";
import { Perk } from "../Perk/Perk";
import { perkname } from "../Perk/Perk.type";

/** An  upgrades contains a perk to be added to the character. */
export class Upgrade implements descriptable
{
  name:string;
  description_text: string;
  /** The perk this upgrade grants. */
  get perk():Perk { return PerkFactory(this.masterService,{Factory:'Perk',type:this.perkname}) }
  private masterService:MasterService;
  private perkname:perkname;
  constructor(masterService:MasterService,name:string,description_text:string,perkname:perkname)
  {
    this.masterService = masterService;
    this.perkname = perkname;
    this.name = name;
    this.description_text = description_text;
  }
  get description(): GameElementDescriptionSection[] {
    return [{type:'description',section_items:[{name:'description',value:this.description_text}]}]
  }
}
