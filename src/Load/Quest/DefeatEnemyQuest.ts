import { Subscription } from "rxjs";
import { MasterService } from "src/app/service/master.service";
import { registerFunction } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { GameElementDescriptionSection
       } from "src/gameLogic/custom/Class/GameElementDescription/GameElementDescription";
import { QuestOptions } from "src/gameLogic/custom/Class/Quest/Quest";

const register:registerFunction = ({quest}, {quest:{Quest}}, Factory)=>{
  class DefeatEnemyQuest extends Quest{
    readonly type:"DefeatEnemyQuest"="DefeatEnemyQuest"
    name: string = "Defeated Enemy";
    descriptionText: string = "Defeat 10 enemies";
    private enemiesDefeated = 0;
    private readonly ENEMY_TARGET = 10;
    private enemyDefeatSubscription:Subscription;
    constructor({partyHandler}: MasterService) {
      super()
      this.enemyDefeatSubscription=partyHandler.onBattleEnded().subscribe(([status,enemyFormation])=>{
        if(status!=="victory")return;
        for(const enemy of enemyFormation)
        { if(enemy.enemyType==='enemyTest')this.enemiesDefeated = Math.min(this.enemiesDefeated,this.ENEMY_TARGET); }
        this.complete()
      })
    }
    toJson(): QuestOptions {
      return {
        Factory:'Quest',
        status:this.status,
        type:"DefeatEnemyQuest",
        enemies_defeated:this.enemiesDefeated
      }
    }
    fromJson(options: QuestOptions): void {
      this.enemiesDefeated = options.enemies_defeated;
      this.status = options.status;
      this.complete();
    }
    complete(){
      this.status = "complete";
      if(this.enemiesDefeated===this.ENEMY_TARGET && this.enemyDefeatSubscription)
        this.enemyDefeatSubscription.unsubscribe()
    }
    get add_description():GameElementDescriptionSection[]{
      return [
        {type: "label",name:"condition",section_items:[
          {name:"enemies_defeated",value:`${this.enemiesDefeated} / ${this.ENEMY_TARGET}`}
        ]}
      ]
    }
  }
  // tslint:disable-next-line: no-string-literal
  quest["DefeatEnemyQuest"]=DefeatEnemyQuest
};

const moduleName = "DefeatEnemyQuest"
const moduleDependency:string[] = []
export { register, moduleName, moduleDependency };
