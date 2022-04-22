import { MasterService } from 'src/app/service/master.service';
import { FactoryForModules } from 'src/gameLogic/core/Factory/Register_Module/RegisterModule';
import { FixedOptions, Scene, SceneOptions } from 'src/gameLogic/custom/Class/Scene/Scene';
import { BattleFactory } from 'src/gameLogic/custom/Factory/BattleFactory';
import { EnemyFormationFactory } from 'src/gameLogic/custom/Factory/EnemyFormationFactory';
import { ItemFactory } from 'src/gameLogic/custom/Factory/ItemFactory';
import { FoolDragonSellerOptions } from './../../quest';

export function sellerScene(masterService:MasterService,Factory:FactoryForModules  ):Scene[]{
  const fixedOptions:FixedOptions=[plantTracker(),attack(),null,null,null];
  const seller = masterService.UniqueCharacterHandler
    .getCharacter('DragonSeller') as unknown as {warryScore:number; distractionScore:number;};
  const quest  = masterService.QuestHolder.get('FoolDragonSeller') as unknown as FoolDragonSellerOptions;
  const sellerProxy = {
    get warryScore(): number{ return seller.warryScore },
    get distractionScore(): number{ return seller.distractionScore },
    set warryScore(value: number){
      seller.warryScore = value;
      if(this.warryScore>=100){
        masterService.sceneHandler.clear("talk").headScene(sellerEscape(),"talk").setScene();
      }
    },
    set distractionScore(value: number){ seller.distractionScore = value; },
  }
  function sellerSceneQuestionAppearance():Scene{
    return {
      sceneData(){
        return 'Seller:Got the money? wait, you look... different. '
      },
      options:[
        {
          text:'I cut my hair.',
          action(){
            masterService.sceneHandler.nextScene(false).headScene(sellerSceneAnswerCutHair(),'talk').setScene();
            sellerProxy.warryScore -= 10;
          },
          disabled:false
        },
        {
          text:'New clothes.',
          action(){
            masterService.sceneHandler.nextScene(false).headScene(sellerSceneAnswerNewClothes(),'talk').setScene();
            sellerProxy.distractionScore += 20;
            sellerProxy.warryScore -= 10;
          },
          disabled:false
        },
        {
          text:'No I don\'t.',
          action(){
            masterService.sceneHandler.nextScene(false).headScene(sellerSceneAnswerNoIDont(),'talk').setScene();
            sellerProxy.warryScore += 10;
          },
          disabled:false
        },
      ],
      fixedOptions,
    };
    function sellerSceneAnswerCutHair():Scene{
      return {
        sceneData(){
          return 'Seller:Is that so? well no matter.'
        },
        options:[
          Factory.options.nextOption(masterService)
        ],
        fixedOptions,
      }
    }
    function sellerSceneAnswerNewClothes():Scene{
      return {
        sceneData(){
          return 'Seller:Well obviouslly. anyway'
        },
        options:[
          Factory.options.nextOption(masterService)
        ],
        fixedOptions,
      }
    }
    function sellerSceneAnswerNoIDont():Scene{
      return {
          sceneData(){
          return 'Seller:Got the money?'
        },
        options:[
          Factory.options.nextOption(masterService)
        ],
        fixedOptions,
      }
    }
  }
  function sellerAskPasssword():Scene{
    return {
      sceneData(){
        return "The passwords.";
      },
      options:[
        {
          text:'There is no password.',
          action(){
            masterService.sceneHandler.nextScene(false).headScene(answerNotPasssword(),'talk').setScene();
          },
          disabled:false
        },
        {
          text:'funny answer.',
          action(){
            masterService.sceneHandler.nextScene(false).headScene(answerBibidiBabidiBu(),'talk').setScene();
            sellerProxy.distractionScore += 30;
            sellerProxy.warryScore -= 10;
          },
          disabled:false
        },
        {
          text:'What?',
          action(){
            masterService.sceneHandler.nextScene(false).headScene(answerWut(),'talk').setScene();
            sellerProxy.warryScore += 20;
          },
          disabled:false
        },
      ],
      fixedOptions
    }
    function answerNotPasssword():Scene{
      return {
        sceneData(){
          return '"There is no password."\nSeller:you are no fun.';
        },
        options:[Factory.options.nextOption(masterService)],
      }
    }
    function answerBibidiBabidiBu():Scene{
      return {
        sceneData(){
          return '"BibidiBabidiBu."\nSeller:pff.';
        },
        options:[Factory.options.nextOption(masterService)],
      }
    }
    function answerWut():Scene{
      return {
        sceneData(){
          return '"No one mentioned an password."\nSeller:I was kidding dude.';
        },
        options:[Factory.options.nextOption(masterService)],
      }
    }
  }
  function sellerRequestPayment():Scene{
    return {
      sceneData(){
        return 'Give me the diamonds, Give you the Egg, the we leave wait a little  then you leave.';
      },
      options:[
        {
          text:'Talk Weather',
          action(){
            masterService.sceneHandler.nextScene(false).headScene(stallSeller(),'talk').setScene();
            sellerProxy.distractionScore += 10;
          },
          disabled:false
        },
        Factory.options.nextOption(masterService,'Give Diamond', ()=>{ gainEgg(); })
      ],
      fixedOptions
    }
    function stallSeller():Scene{
      return {
        sceneData(){
          return "Good weather right?"
        },
        options:[Factory.options.nextOption(masterService,'Give Diamond', ()=>{ gainEgg(); })],
        fixedOptions
      }
    }
  }
  function sellerEscape():Scene{
    return {
      sceneData(){
        gainEgg()
        return "Seller throws the Egg to you opens a secret door and leaves.";
      },
      options:[Factory.options.nextOption(masterService)]
    }
  }
  return [
    sellerSceneQuestionAppearance(),
    sellerAskPasssword(),
    sellerRequestPayment(),
  ];
  function plantTracker():SceneOptions{
    return {
      text:'Plant Tracker',
      action:()=>{
        let scene = plantFailed;
        if(seller.warryScore <= seller.distractionScore){
          scene = plantSucceeded;
        }
        masterService.sceneHandler.headScene(scene(),'talk').setScene();
      },
      get disabled(){return quest.plantedTrack;}
    };
    function plantSucceeded():Scene{
      quest.plantedTrack = true;
      return {
        sceneData:()=>'//TODO add plant success scene text',
        options:[Factory.options.nextOption(masterService)]
      };
    };
    function plantFailed():Scene{
      return sellerEscape();
    };
  }
  function attack():SceneOptions{
    return {
      text:'Attack',
      action:()=>{
        masterService.sceneHandler.clear('talk').headScene(introAttackScene(),'talk').setScene();
      },
      disabled:false
    };
    function introAttackScene():Scene{
      gainEgg();
      return {
        sceneData:()=>'The Seller throws the egg to you and tries to flee but can\'t. ',
        options:[
          Factory.options.nextOption(masterService,'Next',()=>{ enterBattleScene(); })
        ]
      }
    }
    function enterBattleScene():void{
      const enemy = ( Factory as typeof EnemyFormationFactory)(masterService, { Factory:'EnemyFormation',type:'SellerCrew'});
      (Factory as typeof BattleFactory)(masterService,{Factory:'Battle',type:'',enemy}).start();
    }
  }
  function gainEgg(){
    masterService.partyHandler.user.inventory
      .addItem( (Factory as typeof ItemFactory)(masterService,{ Factory:'Item',type:'FakeDragonEgg'}) )
  }
}
