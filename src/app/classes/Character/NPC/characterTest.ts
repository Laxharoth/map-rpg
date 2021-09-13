import { characterType } from "src/app/customTypes/characterTypes";
import { ActionOutput } from "src/app/customTypes/customTypes";
import { randomBetween } from "src/app/htmlHelper/htmlHelper.functions";
import { MasterService } from "../../masterService";
import { PerkCharm } from "../../Perk/PerkCharm";
import { PerkFright } from "../../Perk/PerkFright";
import { PerkGrappler } from "../../Perk/PerkGrappler";
import { Character } from "../Character";
import { TimedStatusTest } from "../Status/TimedStatusTest";

export class charTest extends Character
{
    private _name!:string;
    characterType:characterType = "test character";
    constructor(masterService:MasterService ,name:string='')
    { super({
        hitpoints:200, energypoints:100,
        attack : 20, aim: 20, defence : 20, speed : 20, evasion : 20,
        },masterService);
        this._name = name
        this.addPerk(new PerkCharm(masterService))
        this.addPerk(new PerkGrappler(masterService))
        this.addPerk(new PerkFright(masterService))
        this.addStatus(new TimedStatusTest(masterService));
    }

    get name(): string { return this._name; }
    set name(name: string) { this._name = name;}
    IA_Action(ally: Character[], enemy: Character[]): ActionOutput {
        const target = randomBetween(0,enemy.length-1);
        switch (randomBetween(0,2))
        {
            //ATTACK
            case 0: return this.Attack([enemy[target]]);
            //RANGE
            case 1: return this.Shoot(enemy);
            //DEFEND
            case 2: return this.Defend([this]);
            default: return [[],[]];
        }
    }
    toJson():{[key: string]:any}
    {
      const userjson = super.toJson();
      userjson.name = this._name;
      return userjson;
    }

    fromJson(options: {[key: string]: any}): void
    {
      super.fromJson(options);
      this._name = options.name;
    }
}
