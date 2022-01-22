import { Component, OnInit, Input } from '@angular/core';
import { DescriptableDescriptionOptions, DescriptionOptions } from 'src/gameLogic/custom/Class/Descriptions/Description';

@Component({
  selector: 'app-btn-description-option',
  templateUrl: './btn-description-option.component.html',
  styleUrls: ['./btn-description-option.component.css']
})
export class BtnDescriptionOptionComponent implements OnInit {
  @Input()option:DescriptionOptions
  constructor() { }

  ngOnInit(): void {
  }

  get is_descriptable(): boolean {
    return this.option&&(this.option as DescriptableDescriptionOptions).descriptable !== undefined;
  }
  get has_description(): boolean {
    if(this.is_descriptable) return this.descriptable.description.some(section => section.section_items.length)
    return false;
  }
  get descriptable()
  {
    if(this.is_descriptable)return (this.option as DescriptableDescriptionOptions).descriptable;
    return null
  }
}
