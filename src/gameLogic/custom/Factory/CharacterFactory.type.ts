export enum CharacterTypeValues{
  'test character'='test character',
  'test enemy'='test enemy',
  'john'='john',
  'main-character'='main-character',
}
export const persistentNames:characterType[] = [ 'john' ];

export type characterType = `${CharacterTypeValues}`;
