export enum CharacterTypeValues{
  'test enemy'='test enemy',
}
export enum UniqueCharacterType{
  'test character'='test character',
  'john'='john',
  'main-character'='main-character',
}
export const persistentNames:characterType[] = [ 'john' ];

export type characterType = `${CharacterTypeValues}`|`${UniqueCharacterType}`;
