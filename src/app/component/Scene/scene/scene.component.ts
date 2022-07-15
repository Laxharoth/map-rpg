import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from 'src/app/service/master.service';
import { sceneStringParse } from 'src/gameLogic/custom/Class/Scene/SceneParser';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {
  private descriptionSubscription:Subscription;
  @ViewChild('appGuiDescription', { static: false }) contentDiv!: ElementRef;
  constructor(private masterService:MasterService,private renderer:Renderer2){
    this.descriptionSubscription = this.masterService.sceneHandler.onSetTextScene().subscribe((scene)=>{
      this.updateDescription(scene)
    });
  }
  ngOnInit(): void {
    return undefined;
  }
  ngOnDestroy(): void {
    this.descriptionSubscription.unsubscribe()
  }
  ngAfterViewInit(): void {
    this.updateDescription(this.masterService.sceneHandler.currentScene?.sceneData());
  }
  private updateDescription(description: string){
    const childElements = this.contentDiv.nativeElement.childNodes;
    for (const child of childElements) {
      this.renderer.removeChild(this.contentDiv.nativeElement, child);
    }
    for(const element of sceneStringParse(description,this.renderer)) {
      this.renderer.appendChild(this.contentDiv.nativeElement, element);
    }
  }
}
