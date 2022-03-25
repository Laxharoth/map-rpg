import { MasterService } from "src/app/service/master.service";
import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { Character } from "src/gameLogic/custom/Class/Character/Character";
import { ActionOutput, CalculatedStats } from "src/gameLogic/custom/Class/Character/Character.type";
import { GameElementDescriptionSection } from "src/gameLogic/custom/Class/GameElementDescription/GameElementDescription";
import { specialsname } from "src/gameLogic/custom/Class/Items/Item.type";
import { SpecialAttack } from "src/gameLogic/custom/Class/Items/SpecialAttack/SpecialAttack";
import { StatusStoreable } from "src/gameLogic/custom/Class/Status/Status";
import { statustype } from "src/gameLogic/custom/Class/Status/Status.type";
import { StatusPreventAttack } from "src/gameLogic/custom/Class/Status/StatusBattle";
import { tag } from "src/gameLogic/custom/customTypes/tags";

const register:register_function = ({status,special_attack,perk},{status:{Status,StatusBattle},special_attack:{SpecialAttack},perk:{Perk}},Factory)=>{
class StatusGrappled extends StatusBattle  implements StatusPreventAttack{
  discriminator: "StatusPreventAttack"="StatusPreventAttack";
  readonly type:"Grappled"="Grappled";
  get name(): string { return 'Grappled'; }
  protected DURATION: number = Infinity;
  private _source:Character;
  private _target!:Character;

  constructor(masterService:MasterService,source:Character|null=null){
      super(masterService)
      // @ts-ignore
      this._source = source;
  }

  get description(): string {
      return 'Being grabbed by something impedes movements.'
  }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} is being grabbed by ${this._source.name}`]]; }
  onStatusGainded(target: Character):ActionOutput{
    this._target = target;
    return super.onStatusGainded(target);
  }
    // @ts-ignore
  protected get _stats_modifier():CalculatedStats{
    return { initiative: this._target.calculated_stats.initiative };
  };
  canAttack(target: Character): boolean {return this._source === target;}
  preventAttackDescription(target: Character): ActionOutput {
    return [[],[`${this._target.name} can attack only the grappling one.`]];
  }
  get source(): Character {return this._source;}
  onStatusRemoved(target: Character): ActionOutput
  { return Factory.pushBattleActionOutput(super.onStatusRemoved(target),[[],[`${target.name} is no loger being grappled`]])}

  get tags(): tag[] { return super.tags.concat(['grappled'])}
  fromJson(options: StatusStoreable): void {
    super.fromJson(options)
    this._source=options["source"]
    this._target=options["target"]
  }
}
class StatusGrappling extends StatusBattle implements StatusPreventAttack{
  discriminator: "StatusPreventAttack"="StatusPreventAttack";
  readonly type: "Grappling"="Grappling";
  get name(): statustype { return 'Grappling'; }
  protected DURATION: number = 4;
  private _source!:Character;
  private _target:Character;

  constructor(masterService:MasterService,target:Character|null=null){
      super(masterService);
      // @ts-ignore
      this._target = target;
  }
  get description(): string {
  return 'Being grabbed by something impedes movements.';
  }
  protected effect(target: Character): ActionOutput { return [[],[`${target.name} is grabbing ${this._target.name}`]]; }
  onStatusGainded(target: Character):ActionOutput{
    this._source = target;
    const description:ActionOutput = [[],[`${target.name} is grabbing ${this._target.name}`]];
    return Factory.pushBattleActionOutput(super.onStatusGainded(target),description);
  }
  onStatusRemoved(target: Character): ActionOutput{
    const effectEndedDescription = this._target.removeStatus('Grappled');
    return Factory.pushBattleActionOutput(super.onStatusRemoved(target), effectEndedDescription);
  }
  canAttack(target: Character): boolean {return this._target === target;}
  preventAttackDescription(target: Character): ActionOutput {
    return [[],[`${this._source.name} can attack only the grapped one.`]];
  }
  get target(): Character { return this._target;}
  get tags(): tag[] { return super.tags.concat(['grappling']);}
  fromJson(options: StatusStoreable): void {
    super.fromJson(options)
    this._source=options["source"]
    this._target=options["target"]
  }
}
class SpecialGrab extends SpecialAttack{
  protected COOLDOWN = 6;
  readonly type: "Grab"="Grab";
  get name(): specialsname { return 'Grab' }
  get isPartyUsable(): boolean { return false }
  get isEnemyUsable(): boolean { return true }
  get isSelfUsable(): boolean { return false }
  get isSingleTarget(): boolean { return true }
  get added_description_sections(): GameElementDescriptionSection[]
  { return [ {name: "description",section_items:[{name: "description",value:'grab'}]}, ]}

  protected _itemEffect(user:Character,target: Character): ActionOutput {
      const description:ActionOutput = [[],[]];
      Factory.pushBattleActionOutput(user.addStatus(new StatusGrappling(this.masterService,target)),description)
      Factory.pushBattleActionOutput(target.addStatus(new StatusGrappled(this.masterService,user)),description)
      return description;
  }
}
class PerkGrappler extends Perk {
  readonly specialGrab = new SpecialGrab(this.masterService)
  readonly type: "Grappler"="Grappler";
  get name():string { return 'Grappler'; }
  get specials() :SpecialAttack[]{return [this.specialGrab]}
}
status["Grappling"]=StatusGrappling;
status["Grappled"]=StatusGrappled;
special_attack["Grab"]=SpecialGrab;
perk["Grappler"]=PerkGrappler;
}

const module_name = "Grab"
const module_dependency:string[] = []
export { register, module_name, module_dependency }
