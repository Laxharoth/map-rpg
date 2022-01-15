import { descriptable, GameElementDescriptionSection } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';
import { storeable, StoreableType } from "src/gameLogic/core/Factory/Factory";

export interface Quest extends storeable
{
  name: string;
  description_text: string;
  toJson(): StoreableType;
  fromJson(options: StoreableType): void;
  add_description:GameElementDescriptionSection[];
}

export class quest_descriptable_prototype{
  get description(): GameElementDescriptionSection[]
  {
    return [
      //@ts-ignore
      {name:"name",section_items:[{name:'name',value:this.name}]},
      //@ts-ignore
      {name:"description",section_items:[{name:'description',value:this.description_text}]},
      //@ts-ignore
      ...this.add_description
    ]
  }
}

