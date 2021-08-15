import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Description, DescriptionOptions } from 'src/app/classes/Description';
import { DescriptionHandlerService } from 'src/app/service/description-handler.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  @Input() descriptionhandler:DescriptionHandlerService;

  currentDescription:Description;

  constructor() { }

  ngOnInit(): void {
    this.descriptionhandler.onSetDescription().subscribe((description)=>{
      this.currentDescription = description;
    });
    this.descriptionhandler.setDescription();
  }

}
