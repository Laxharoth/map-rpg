import { Descriptable, GameElementDescriptionSection } from 'src/gameLogic/custom/Class/GameElementDescription/GameElementDescription';
import { Storeable } from "src/gameLogic/core/Factory/Factory";
import { Hashable } from '../../ClassHelper/ObjectSet';
import { questnames, questStatus } from './Quest.type';

export abstract class Quest implements Storeable, Descriptable,Hashable
{
  abstract type: questnames;
  abstract name: string;
  abstract descriptionText: string;
  abstract toJson(): QuestOptions;
  abstract fromJson(options: QuestOptions): void;
  status: questStatus="in progress";

  get add_description():GameElementDescriptionSection[]{return []};
  get description(): GameElementDescriptionSection[]{
    return [
      {type:"name",section_items:[{name:'name',value:this.name}]},
      {type:"description",section_items:[{name:'description',value:this.descriptionText}]},
      ...this.add_description
    ]
  }
  /** sets the status based on the quest conditions.  */
  abstract complete():void;
  // @ts-ignore
  hash(): string { return this.constructor }
}
export type QuestOptions = {
  Factory: 'Quest',
  type: questnames,
  status: questStatus,
  [key:string]:any
}
