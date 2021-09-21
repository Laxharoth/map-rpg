import { ElementRef, Input, ViewChild } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Map } from 'src/app/classes/maps/map';
import { MasterService } from 'src/app/classes/masterService';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() masterService:MasterService;
  @Output() moveEvent = new EventEmitter<string>();

  lockedMap:boolean;
  LockedWASD = {UP:false,DOWN:false,LEFT:false,RIGHT:false}
  currentCoordinates=[0,0];
  currentMap:Map;
  timeValues:{ Years: number; Months: number; Days: number; Hours: number; Minutes: number; };

  private mapSubscription:Subscription;
  private lockmapSubscription:Subscription;
  private coordinatesSubscription: Subscription;
  private timeSubscription: Subscription;

  @ViewChild('mapwrapper') mapWrapper: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.InitializeSubscriptions();
    this.setLockedWASD()
  }

  ngAfterViewInit(): void {
    this.setMapOverflow();
  }

  ngOnDestroy(): void {
    this.mapSubscription?.unsubscribe();
    this.lockmapSubscription?.unsubscribe();
    this.coordinatesSubscription?.unsubscribe();
    this.timeSubscription?.unsubscribe();
  }

  move(direction)
  {
    this.moveEvent.emit(direction);
  }

  private setMapOverflow()
  {
    const mapWrapper = this.mapWrapper.nativeElement;
    const currentTile=mapWrapper.getElementsByClassName('current')[0].parentNode;
    const { width:parentWidth,height:parentHeight } = mapWrapper.getBoundingClientRect();
    const { width,height, } = currentTile.getBoundingClientRect();
    let [y,x] = [height*this.currentCoordinates[0],width*this.currentCoordinates[1]];

    x-=parentWidth/2;
    y-=parentHeight/2;

    mapWrapper.scrollLeft = x;
    mapWrapper.scrollTop = y;
  }
  private setLockedWASD()
  {
    const [y,x] = this.currentCoordinates;
    this.LockedWASD = {
      UP:this.currentMap.roomsNames[y-1]?.[x]?false:true,
      DOWN:this.currentMap.roomsNames[y+1]?.[x]?false:true,
      LEFT:this.currentMap.roomsNames[y][x-1]?false:true,
      RIGHT:this.currentMap.roomsNames[y][x+1]?false:true,
    };
  }
  private InitializeSubscriptions() {
    this.currentCoordinates = this.masterService.mapHandler.coordinates;
    this.lockedMap = this.masterService.lockmap.isMapLocked();
    this.currentMap = this.masterService.mapHandler.currentMap;
    this.timeValues = this.masterService.flagsHandler.getTimeValues();
    this.coordinatesSubscription = this.masterService.mapHandler.onCoordinatesChanged().subscribe(changedCoordinates => {
      this.currentCoordinates = changedCoordinates;
      this.setLockedWASD();
      this.setMapOverflow();
    });
    this.mapSubscription = this.masterService.mapHandler.onLoadMap().subscribe(loadedMap => { this.currentMap = loadedMap; });
    this.lockmapSubscription = this.masterService.lockmap.onMapLockChanged().subscribe(isMapLocked => { this.lockedMap = isMapLocked; });
    this.timeSubscription = this.masterService.flagsHandler.onTimeChanged().subscribe(time => { this.timeValues = time.getTimeValues(); });
  }
}
