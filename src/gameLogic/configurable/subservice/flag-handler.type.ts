export enum FlagNames {
  currentmap="currentmap",
  currentroom="currentroom",
  map1room1firstenter="map1room1firstenter",
  map1room1firstexit="map1room1firstexit",
  firstreturn2room1="firstreturn2room1",
  caninroom1="caninroom1",
  pet="pet",
  petshout="petshout",
  "FoolDragonSeller-plantedTrack"="FoolDragonSeller-plantedTrack",
  "FoolDragonSeller-inspectedEgg"="FoolDragonSeller-inspectedEgg",
  "first-enter-barn"="first-enter-barn",
  "first-close-spy"="first-close-spy",
  "talked-with-harper"="talked-with-harper",
  "fought-thug"="fought-thug",
  "thug-revenge"="thug-revenge",
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
  "FoolDragonSeller-plantedTrack":false,
  "FoolDragonSeller-inspectedEgg":false,
  "first-enter-barn":false,
  "first-close-spy":false,
  "talked-with-harper":false,
  "fought-thug":false,
  "thug-revenge":false,
}
