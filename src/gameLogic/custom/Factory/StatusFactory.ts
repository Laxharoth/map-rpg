import { MasterService } from "src/app/service/master.service";
import { FactoryFunction } from "src/gameLogic/configurable/Factory/FactoryMap";
import { Status, StatusStoreable } from "src/gameLogic/custom/Class/Status/Status";
import { TimedStatusTest } from "src/gameLogic/custom/Class/Status/TimedStatusTest";

/** Creates a Status given a status name. */
export const StatusFactory:FactoryFunction<Status,StatusStoreable> = (masterService,options)=>{
  const status = new statusSwitcher[options.type](masterService);
  status.fromJson(options);
  return status;
}
// @ts-ignore
export const statusSwitcher:{[key in statusEnum | statusTimeEnum | statusBattlesEnum]:StatusConstructor}={
  'TimedStatusTest'   :TimedStatusTest,
}
export type StatusConstructor = new(MasterService: MasterService) => Status;
export type StatusFactoryFuctioin = typeof StatusFactory;
