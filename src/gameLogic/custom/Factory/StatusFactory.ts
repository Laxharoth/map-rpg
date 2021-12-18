import { MasterService } from "src/app/service/master.service";
import { Status } from "src/gameLogic/custom/Class/Status/Status";
import { statusEnum, statusname, statusTimeEnum } from "src/gameLogic/custom/Class/Status/Status.type";
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
export function StatusFactory(masterService:MasterService,options:{[key: string]: any}):Status
{
  const status = new statusSwitcher[options.type](masterService);
  status.fromJson(options);
  return status;
}

/** @type {[key: string]:Status.constructor} */
const statusSwitcher:{[key in statusEnum|statusTimeEnum]}={
  'status':()=>null,
  'TimedStatusTest'   :TimedStatusTest,
}
