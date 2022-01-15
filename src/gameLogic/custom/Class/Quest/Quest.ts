import { GameElementDescriptionSection } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';
import { storeable, StoreableType } from "src/gameLogic/core/Factory/Factory";

export interface Quest extends storeable
{
  name: string;
  description_text: string;
  toJson(): StoreableType;
  fromJson(options: StoreableType): void;
  add_description:GameElementDescriptionSection[];
}

export function quest_description(): GameElementDescriptionSection[]
{
  return [
    {name:"name",section_items:[{name:'name',value:this.name}]},
    {name:"description",section_items:[{name:'description',value:this.description_text}]},
    ...this.add_description
  ]
}
