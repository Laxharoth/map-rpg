import { Room } from "../classes/maps/room";
import { DescriptionHandlerService } from "../service/description-handler.service";
import { FlagHandlerService } from "../service/flag-handler.service";
import { MapHandlerService } from "../service/map-handler.service";

export type roomFunction = (flagshandler: FlagHandlerService, descriptionhandler: DescriptionHandlerService, maphandler: MapHandlerService) => Room;
export type inputObject  = {default: string , placeholder: string}
