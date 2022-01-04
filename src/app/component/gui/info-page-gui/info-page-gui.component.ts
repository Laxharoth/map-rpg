import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-page-gui',
  templateUrl: './info-page-gui.component.html',
  styleUrls: ['./info-page-gui.component.css']
})
export class InfoPageGuiComponent implements OnInit {
  current_tab = 'A'
  constructor() { }

  ngOnInit(): void {
  }

  set_tab(event:Event)
  {
    //@ts-ignore
    const tab_target = event.target.getAttribute('for') ;
    if(tab_target) this.current_tab = tab_target ;
  }
}
