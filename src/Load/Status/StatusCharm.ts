import { MasterService } from "src/app/service/master.service";
import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { GameElementDescriptionSection } from "src/gameLogic/custom/Class/GameElementDescription/GameElementDescription";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { StatusStoreable } from "src/gameLogic/custom/Class/Status/Status";
import { StatusPreventAttack } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:register_function = ({status,special_attack,perk},{status:{StatusBattle},special_attack:{SpecialAttack},perk:{Perk}},Factory)=>{
  class StatusCharm extends StatusBattle implements StatusPreventAttack
  {
    discriminator:"StatusPreventAttack"="StatusPreventAttack";
    readonly type:"Charm"="Charm";
    protected DURATION: number = 3;
    private _charmer:Character;
    private _charmed:Character;
    constructor(masterService:MasterService, charmer:Character=null, charmed:Character=null)
    {
        super(masterService)
        this._charmer = charmer;
        this._charmed = charmed;
    }
    get name(): string { return 'Charm'; }
    get description(): string {
      return "Can't hurt charmer";
    }
    protected effect(target: Character): ActionOutput { return [[],[`${this._charmed.name} is charmed by ${this._charmer.name}`]]}

    canAttack(target: Character): boolean {return this._charmer !== target;}
    preventAttackDescription(target: Character): ActionOutput { return [[],[`${this._charmed.name} is charmed and can't attack ${this._charmer.name}`]] }
    get tags(): tag[] { return super.tags.concat(['charm'])}
    fromJson(options: StatusStoreable): void {
      super.fromJson(options)
      this._charmer=options["source"]
      this._charmed=options["target"]
    }
  }
  status["Charm"]=StatusCharm
  class SpecialCharm extends SpecialAttack
  {
    protected COOLDOWN: number=6;
    readonly type:"Charm"="Charm";
    get name(): specialsname { return 'Charm'; }
    get isPartyUsable(): boolean { return false; }
    get isEnemyUsable(): boolean { return true; }
    get isSelfUsable() : boolean { return false; }
    get isSingleTarget(): boolean { return true; }
    get added_description_sections(): GameElementDescriptionSection[]
    { return [ {name: "description",section_items:[{name: "description",value:'charm'}]}, ]}
    protected _itemEffect(user:Character,target: Character): ActionOutput {
      return target.addStatus(new StatusCharm(this.masterService,user,target))
    }
  }
  class PerkCharm extends Perk {
    readonly type:"PerkCharm"="PerkCharm";
    readonly charmSpecial = new SpecialCharm(this.masterService)
    get name():string { return 'Charmer';}
    get specials(): SpecialAttack[] {return [this.charmSpecial] }
  }
  status["Charm"]=StatusCharm
  special_attack["Charm"]=SpecialCharm
  perk["PerkCharm"]=PerkCharm
}
const module_name = "Charm";
const module_dependency = [];
export { register, module_name, module_dependency}
