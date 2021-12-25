export enum FlagNames {
  currentmap="currentmap",
  currentroom="currentroom",
  map1room1firstenter="map1room1firstenter",
  map1room1firstexit="map1room1firstexit",
  firstreturn2room1="firstreturn2room1",
  caninroom1="caninroom1",
  pet="pet",
  petshout="petshout",
}

export type flagname = `${FlagNames}`

export const default_flags:{[key in FlagNames]:any} = {
  currentmap : 'map1',
  currentroom: 'room1',
  map1room1firstenter : true,
  map1room1firstexit  : true,
  firstreturn2room1   : true,
  caninroom1          : true,
  pet:null,
  petshout:null,
}
