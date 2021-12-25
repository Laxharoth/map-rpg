export enum factNameListEnum
{
  a="a"
}

export type factName = `${factNameListEnum}`

export type acquaintaceness = number;
export type fact_importance = number;

export type CharacterDataWebData = {
  acquaintacer_map:Map<string,acquaintaceness>;
  known_facts:Set<factName>;
}
