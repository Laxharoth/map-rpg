import { primitive } from "src/gameLogic/core/types";

export interface GameElementDescriptionSection
{
  name: section_names;
  section_items:game_element_description_section_item[]
}
export interface game_element_description_section_item
{
  name: string;
  value:primitive;
}
export interface descriptable
{
  get description():GameElementDescriptionSection[];
}
enum section_names_enum {
  tags="tags",
  cooldown="cooldown",
  description="description",
  stats="stats",
  resistance="resistance",
  damage="damage",
  name="name",
  condition="condition",
}
export type section_names = `${section_names_enum}`
