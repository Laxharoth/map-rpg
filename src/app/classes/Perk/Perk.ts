import { tag } from "src/app/customTypes/tags";
import { MasterService } from "../masterService";

export abstract class Perk
{
    masterService:MasterService;
    constructor(masterService:MasterService)
    { this.masterService = masterService; }

    abstract get tags(): tag[];
}