import { tag } from "src/app/customTypes/tags";
import { Reaction } from "../Character/Reaction/Reaction";
import { SpecialAttack } from "../Items/SpecialAttack/SpecialAttack";
import { MasterService } from "../masterService";

export abstract class Perk
{
    abstract get name():string;
    protected readonly masterService:MasterService;
    constructor(masterService:MasterService)
    { this.masterService = masterService; }

    get tags(): tag[] { return []; }
    get reactions(): Reaction[]{ return []}
    get specials():SpecialAttack[] { return []}
}