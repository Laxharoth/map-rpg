export enum factNameListEnum{
  a="a"
}
export type factName = `${factNameListEnum}`
export type acquaintaceness = number;
export type factImportance = number;
export type CharacterDataWebData = {
  acquaintacerMap:Map<string,acquaintaceness>;
  knownFacts:Set<factName>;
}
export type hashed_acquanitance = [character1_id:string, character2_id:string,closeness:number]
