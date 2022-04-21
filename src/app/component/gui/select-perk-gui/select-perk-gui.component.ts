import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MasterService } from 'src/app/service/master.service';
import { UniqueCharacter } from 'src/gameLogic/custom/Class/Character/UniqueCharacter';
import { tree_node } from 'src/gameLogic/custom/Class/CharacterBattleClass/ArrayTree';
import { nextOption } from 'src/gameLogic/custom/Class/Scene/CommonOptions';
import { Scene, SceneOptions } from 'src/gameLogic/custom/Class/Scene/Scene';
import { Upgrade } from 'src/gameLogic/custom/Class/Upgrade/Upgrade';
import { compareArray } from 'src/gameLogic/custom/functions/htmlHelper.functions';

@Component({
  selector: 'app-select-perk-gui',
  templateUrl: './select-perk-gui.component.html',
  styleUrls: ['./select-perk-gui.component.css']
})
export class SelectPerkGuiComponent implements OnInit {

  get fixedPath():number[]{return this.character.levelStats.upgradePath};
  selectedPath:number[]=[];
  private character!: UniqueCharacter;
  private getCharacterSubsciption:Subscription;
  constructor(private masterService:MasterService) {
    this.getCharacterSubsciption = this.masterService.sceneHandler.onSetScene().subscribe((scene) => {
      this.initializeScene(scene)
    })
    this.initializeScene(masterService.sceneHandler.currentScene as Scene)
    masterService.sceneHandler.setScene(false);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.getCharacterSubsciption && this.getCharacterSubsciption.unsubscribe();
  }

  upgradeOptions(path: number[]):tree_node<Upgrade>[]{
    return this.character.upgrade_options(path);
  }

  updateSelectedPath(e:Event){
    const [depth,index] = e as unknown as [number,number];
    const newSelectedPath = this.selectedPath.slice(0,depth)
    newSelectedPath.push(index)
    // @ts-ignore
    newSelectedPath.push(null)
    this.selectedPath = newSelectedPath;
  }

  private _optionSelect!:SceneOptions;
  get optionSelect():SceneOptions{
    const masterService = this.masterService;
    const selected_path = this.selectedPath;
    const fixed_path = this.fixedPath;
    const character = this.character;
    if (!this._optionSelect)
      this._optionSelect = {
        text: 'select',
        action(){
          const newSelected = selected_path.slice(fixed_path.length, -1)
          for (const selected of newSelected) {
            character.upgrade(selected)
            if (character.levelStats.perkPoint === 0) break;
          }
          masterService.sceneHandler.nextScene(false);
        },
        get disabled() {
          return !compareArray(fixed_path, selected_path.slice(0, fixed_path.length))
        }
      }
    return this._optionSelect;
  }
  private _optionSkip!:SceneOptions;
  get option_skip():SceneOptions{
    if(!this._optionSkip)this._optionSkip = nextOption(this.masterService,'skip');
    return this._optionSkip;
  }
  private _optionReset!:SceneOptions
  get option_reset():SceneOptions{
    if (!this._optionReset) this._optionReset = {
      text: 'reset',
      action: () => {
        this.selectedPath = [...this.fixedPath]
      },
      disabled: false
    }
    return this._optionReset;
  }
  private initializeScene(description:Scene){
    const character = description.sceneData();
    if(!(character instanceof UniqueCharacter))return;
    if(character.levelStats.perkPoint===0) { this.masterService.sceneHandler.nextScene(false); return; }
    this.character = character;
    //@ts-ignore
    this.selectedPath = [...this.character.levelStats.upgradePath,null]
    const fixedOptions = description.fixedOptions;
    if(fixedOptions){
      fixedOptions[0] = this.optionSelect;
      fixedOptions[1] = this.option_reset;
      fixedOptions[4] = this.option_skip;
    }
  }
}
