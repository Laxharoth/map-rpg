import { MasterService } from "src/app/service/master.service";
import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from 'src/gameLogic/custom/Class/Character/Character';
import { ActionOutput } from "src/gameLogic/custom/Class/Character/Character.type";
import { GameElementDescriptionSection
       } from "src/gameLogic/custom/Class/GameElementDescription/GameElementDescription";
import { StatusStoreable } from "src/gameLogic/custom/Class/Status/Status";
import { StatusPreventAttack } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:registerFunction = ({status,specialAttack,perk},
    {status:{Status,StatusBattle},specialAttack:{SpecialAttack},perk:{Perk}},Factory)=>{
  class StatusFright extends StatusBattle implements StatusPreventAttack{
    type:"Fright"="Fright";
    get name(): string { return 'Fright'; }
    protected DURATION: number = 3;
    private frighted:Character;
    private frighter:Character;
    constructor(masterService:MasterService, frighted:Character|null=null, frighter:Character|null=null){
        super(masterService)
        // @ts-ignore
        this.frighter = frighter;
        // @ts-ignore
        this.frighted = frighted;
    }
    discriminator: "StatusPreventAttack"="StatusPreventAttack";
    get description(): string {
      return "Can't hurt fear source.";
    }
    onStatusGainded(target: Character){
    const description:ActionOutput = [[],[`${this.frighted.name} is intimidated by ${this.frighter.name}`]]
    return Factory.pushBattleActionOutput(super.onStatusGainded(target),description)
    }
    protected effect(target: Character): ActionOutput {
      return [[],[`${this.frighted.name} fears ${this.frighter.name}`]]
    }
    canAttack(target: Character): boolean {if(this.frighter === target) return Factory.randomCheck(30); return true;}
    preventAttackDescription(target: Character): ActionOutput {
    return [[],[`${this.frighted.name} fears ${this.frighter.name} and can't act.`]];
    }
    get tags(): tag[] { return super.tags.concat(['fright'])}
    fromJson(options: StatusStoreable): void {
      super.fromJson(options)
      this.frighter=options.source
      this.frighted=options.target
    }
  }
  // tslint:disable: max-classes-per-file
  class SpecialFright extends SpecialAttack{
    protected COOLDOWN: number = 4;
    type:"Fright"="Fright";
    get name(): string { return 'Fright' }
    get isPartyUsable(): boolean { return false }
    get isEnemyUsable(): boolean { return true }
    get isSelfUsable(): boolean { return false }
    get isSingleTarget(): boolean { return true }
    get added_description_sections(): GameElementDescriptionSection[]
    { return [ {type: "description",section_items:[{name: "description",value:'fright'}]}, ]}
    protected _itemEffect(user:Character,target: Character): ActionOutput{
        return target.addStatus(new StatusFright(this.masterService,target,user))
    }
  }
  class PerkFright extends Perk {
    readonly specialFright = new SpecialFright(this.masterService)
    readonly type:"PerkFright"="PerkFright";
    get name(): string { return 'Frighter' }

    get specials(){return [this.specialFright]}
  }
  // tslint:disable: no-string-literal
  status["Fright"]=StatusFright
  specialAttack["Fright"]=SpecialFright
  // @ts-ignore
  perk["Frighter"]=PerkFright
}
const moduleName="Fright"
const moduleDependency:string[] = []
export { register, moduleName, moduleDependency}
