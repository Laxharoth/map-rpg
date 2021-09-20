export enum CharacterTypeValues{
  'test character'='test character',
  'test enemy'='test enemy',
  'john'='john',
}
export const persistentNames:characterType[] = [ 'john' ];

export type characterType = `${CharacterTypeValues}`;
