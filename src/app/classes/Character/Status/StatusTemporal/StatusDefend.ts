import { battleActionOutput } from "src/app/customTypes/customTypes";
import { Character } from "../../Character";
import { StatusFight } from "../StatusFight";

export class StatusDefend extends StatusFight
{
  protected DURATION: number = 1;
  get name(): string { return 'defend'; }
  get description(): string { return 'Increases defence and evasion.'; }
  protected effect(target: Character): battleActionOutput {
    target.roundStats.defence*=(target.hasTag('no shield'))?1.2:1.7;
    target.roundStats.evasion*=1.3;
    return [[],[`${target.name} raises it's defence.`]];
  }
  onStatusGainded(target: Character):battleActionOutput
  { return this.applyEffect(target); }
}
