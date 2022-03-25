import { Subscription } from "rxjs";
import { MasterService } from "src/app/service/master.service";
import { register_function } from "src/gameLogic/core/Factory/Register_Module/RegisterModule";
import { GameElementDescriptionSection } from "src/gameLogic/custom/Class/GameElementDescription/GameElementDescription";
import { QuestOptions } from "src/gameLogic/custom/Class/Quest/Quest";

const register:register_function = ({quest}, {quest:{Quest}}, Factory)=>{
  class DefeatEnemyQuest extends Quest
  {
    readonly type:"DefeatEnemyQuest"="DefeatEnemyQuest"
    name: string = "Defeated Enemy";
    description_text: string = "Defeat 10 enemies";
    private enemies_defeated = 0;
    private readonly ENEMY_TARGET = 10;
    private enemy_defeat_subscription:Subscription;
    constructor({partyHandler}: MasterService) {
      super()
      this.enemy_defeat_subscription=partyHandler.onBattleEnded().subscribe(([status,enemy_formation])=>{
        if(status!=="victory")return;
        for(const enemy of enemy_formation)
        { if(enemy.enemy_type==='enemyTest')this.enemies_defeated = Math.min(this.enemies_defeated,this.ENEMY_TARGET); }
        this.complete()
      })
    }
    toJson(): QuestOptions {
      return {
        Factory:'Quest',
        status:this.status,
        type:"DefeatEnemyQuest",
        enemies_defeated:this.enemies_defeated
      }
    }
    fromJson(options: QuestOptions): void {
      this.enemies_defeated = options.enemies_defeated;
      this.status = options.status;
      this.complete();
    }
    complete(){
      this.status = "complete";
      if(this.enemies_defeated===this.ENEMY_TARGET)this.enemy_defeat_subscription&&this.enemy_defeat_subscription.unsubscribe()
    }
    get add_description():GameElementDescriptionSection[]{
      return [
        {type: "label",name:"condition",section_items:[
          {name:"enemies_defeated",value:`${this.enemies_defeated} / ${this.ENEMY_TARGET}`}
        ]}
      ]
    }
  }
  quest["DefeatEnemyQuest"]=DefeatEnemyQuest
};

const module_name = "DefeatEnemyQuest"
const module_dependency:string[] = []
export { register, module_name, module_dependency };
