import { TimedStatusTest } from '../Status/TimedStatusTest';
import { MasterService } from "src/app/service/master.service";
import { statusEnum, statusname, statusTimeEnum } from "src/app/customTypes/statusnames";
import { Status } from "../Status/Status";

/**
 * Creates a Status given a status name.
 *
 * @export
 * @param {MasterService} masterService The master service
 * @param {statusname} statusname The status name
 * @param {{[key: string]: any}} options The options from the status created with the storeable.toJson
 * @return {*}  {Status} An Status with the loaded options
 */
export function StatusFactory(masterService:MasterService,statusname:statusname,options:{[key: string]: any}):Status
{
  const status = new statusSwitcher[statusname](masterService);
  status.fromJson(options);
  return status;
}

/** @type {[key: string]:Status.constructor} */
const statusSwitcher:{[key in statusEnum|statusTimeEnum]}={
  'status':()=>null,
  'TimedStatusTest'   :TimedStatusTest,
}
