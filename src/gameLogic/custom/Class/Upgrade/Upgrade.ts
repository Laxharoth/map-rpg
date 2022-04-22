import { MasterService } from "src/app/service/master.service";
import { PerkFactory } from "../../Factory/PerkFactory";
import { Descriptable, GameElementDescriptionSection } from "../GameElementDescription/GameElementDescription";
import { Perk } from "../Perk/Perk";
import { perkname } from "../Perk/Perk.type";

/** An  upgrades contains a perk to be added to the character. */
export class Upgrade implements Descriptable{
  name:string;
  descriptionText: string;
  /** The perk this upgrade grants. */
  get perk():Perk { return PerkFactory(this.masterService,{Factory:'Perk',type:this.perkname}) }
  private masterService:MasterService;
  private perkname:perkname;
  constructor(masterService:MasterService,name:string,descriptionText:string,perkName:perkname){
    this.masterService = masterService;
    this.perkname = perkName;
    this.name = name;
    this.descriptionText = descriptionText;
  }
  get description(): GameElementDescriptionSection[] {
    return [{type:'description',section_items:[{name:'description',value:this.descriptionText}]}]
  }
}
