import { descriptable, GameElementDescriptionSection } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';
import { storeable } from "src/gameLogic/core/Factory/Factory";
import { hashable } from '../../ClassHelper/ObjectSet';

export abstract class Quest implements storeable, descriptable,hashable
{
  abstract type: string;
  abstract name: string;
  abstract description_text: string;
  abstract toJson(): QuestOptions;
  abstract fromJson(options: QuestOptions): void;
  get add_description():GameElementDescriptionSection[]{return []};
  get description(): GameElementDescriptionSection[]
  {
    return [
      {name:"name",section_items:[{name:'name',value:this.name}]},
      {name:"description",section_items:[{name:'description',value:this.description_text}]},
      ...this.add_description
    ]
  }
  //@ts-ignore
  hash(): string { return this.constructor }
}
export type QuestOptions = {
  Factory: 'Quest',
  type: "DefeatEnemyQuest",
  [key:string]:any
}
