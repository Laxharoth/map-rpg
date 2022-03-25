import { primitive } from "src/gameLogic/core/types";

export interface GameElementDescriptionSection{
  type: section_names;
  name?: string;
  section_items:game_element_description_section_item[]
}
export interface game_element_description_section_item{
  name?: string;
  value:primitive;
}
export interface descriptable{
  get description():GameElementDescriptionSection[];
}
enum section_names_enum {
  name="name",
  list="list",
  description="description",
  label="label",
  sequence="sequence",
}
export type section_names = `${section_names_enum}`
