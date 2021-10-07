import { Component, OnInit, Input } from '@angular/core';
import { Item } from 'src/app/classes/Items/Item';

@Component({
  selector: 'app-shop-data-item',
  templateUrl: './shop-data-item.component.html',
  styleUrls: ['./shop-data-item.component.css']
})
export class ShopDataItemComponent implements OnInit {

  @Input() item:Item;
  constructor() { }

  ngOnInit(): void {
  }
}
