import { TimedStatusTest } from '../Status/TimedStatusTest';
import { MasterService } from "src/app/classes/masterService";
import { statusEnum, statusname, statusTimeEnum } from "src/app/customTypes/statusnames";
import { Status } from "../Status/Status";

export function StatusFactory(masterService:MasterService,statusname:statusname,options:{[key: string]: any}):Status
{
  const status = new statusSwitcher[statusname](masterService);
  status.fromJson(options);
  return status;
}

const statusSwitcher:{[key in statusEnum|statusTimeEnum]}={
  'status':()=>null,
  'TimedStatusTest'   :TimedStatusTest,
}
