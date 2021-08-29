import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-character-stat',
  templateUrl: './character-stat.component.html',
  styleUrls: ['./character-stat.component.css']
})
export class CharacterStatComponent implements OnInit {

  @Input() statName: string;
  @Input() statValue: number;
  @Input() maxValue: number = 100;
  @Input() barColor = "red";

  constructor(){}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}

}
