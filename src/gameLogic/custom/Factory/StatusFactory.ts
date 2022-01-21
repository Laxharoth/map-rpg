import { MasterService } from "src/app/service/master.service";
import { Status, StatusStoreable } from "src/gameLogic/custom/Class/Status/Status";
import { TimedStatusTest } from "src/gameLogic/custom/Class/Status/TimedStatusTest";

/**
 * Creates a Status given a status name.
 *
 * @export
 * @param {MasterService} masterService The master service
 * @param {statusname} statusname The status name
 * @param {{[key: string]: any}} options The options from the status created with the storeable.toJson
 * @return {*}  {Status} An Status with the loaded options
 */
export function StatusFactory(masterService:MasterService,options:StatusStoreable):Status
{
  const status = new status_switcher[options.type](masterService);
  status.fromJson(options);
  return status;
}
//@ts-ignore
export const status_switcher:{[key in statusEnum | statusTimeEnum | statusBattlesEnum]:StatusConstructor}={
  'TimedStatusTest'   :TimedStatusTest,
}
export interface StatusConstructor { new(MasterService: MasterService): Status; }
export type StatusFactoryFuctioin = typeof StatusFactory;
