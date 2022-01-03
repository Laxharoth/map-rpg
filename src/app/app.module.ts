import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterStatComponent } from './component/character-stat/character-stat.component';
import { CharacterUserComponent } from './component/character-user/character-user.component';
import { DescriptionOptionsComponent } from './component/description-options/description-options.component';
import { DescriptionComponent } from './component/description/description.component';
import { DropableItemComponent } from './component/dropable-item/dropable-item.component';
import { EquipedEquipmentComponent } from './component/equiped-equipment/equiped-equipment.component';
import { EquipmentOnCharacterComponent } from './component/equipment-on-character/equipment-on-character.component';
import { BattleGuiComponent } from './component/gui/battle-gui/battle-gui.component';
import { ExcessItemGuiComponent } from './component/gui/excess-item-gui/excess-item-gui.component';
import { GuiComponent } from './component/gui/gui.component';
import { ItemGuiComponent } from './component/gui/item-gui/item-gui.component';
import { MapGuiComponent } from './component/gui/map-gui/map-gui.component';
import { ShopGuiComponent } from './component/gui/shop-gui/shop-gui.component';
import { StatusGuiComponent } from './component/gui/status-gui/status-gui.component';
import { MapComponent } from './component/map/map.component';
import { NumberSpinnerComponent } from './component/number-spinner/number-spinner.component';
import { PartyMemberComponent } from './component/party-member/party-member.component';
import { PartyComponent } from './component/party/party.component';
import { ShopDataComponentComponent } from './component/shop/shop-data-component/shop-data-component.component';
import { ShopDataItemComponent } from './component/shop/shop-data-item/shop-data-item.component';
import { ShopInterfaceComponent } from './component/shop/shop-interface/shop-interface.component';
import { ShopItemComponent } from './component/shop/shop-item/shop-item.component';
import { ShopSaleComponentComponent } from './component/shop/shop-sale-component/shop-sale-component.component';
import { StatusIconComponent } from './component/status-icon/status-icon.component';
import { TabMenuComponent } from './component/tab-menu/tab-menu.component';
import { UserExperienceComponent } from './component/user-experience/user-experience.component';
import { OverrideCssVarDirective } from './directive/override-css-var.directive';
import { DescriptableDescriptionComponent } from './component/descriptable/descriptable-description/descriptable-description.component';
import { DescriptionSwitchComponent } from './component/descriptable/description-switch/description-switch.component';
import { BtnDescriptionOptionComponent } from './component/btn-description-option/btn-description-option.component';
import { SelectPerkGuiComponent } from './component/gui/select-perk-gui/select-perk-gui.component';
import { PerkUpItemComponent } from './component/perk-up/perk-up-item/perk-up-item.component';
import { PerkUpRowComponent } from './component/perk-up/perk-up-row/perk-up-row.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    GuiComponent,
    DescriptionComponent,
    DescriptionOptionsComponent,
    PartyComponent,
    PartyMemberComponent,
    CharacterUserComponent,
    StatusIconComponent,
    OverrideCssVarDirective,
    CharacterStatComponent,
    TabMenuComponent,
    ShopInterfaceComponent,
    ShopItemComponent,
    NumberSpinnerComponent,
    ShopDataComponentComponent,
    ShopSaleComponentComponent,
    ShopDataItemComponent,
    MapGuiComponent,
    BattleGuiComponent,
    ItemGuiComponent,
    ShopGuiComponent,
    StatusGuiComponent,
    UserExperienceComponent,
    ExcessItemGuiComponent,
    DropableItemComponent,
    EquipedEquipmentComponent,
    EquipmentOnCharacterComponent,
    DescriptableDescriptionComponent,
    DescriptionSwitchComponent,
    BtnDescriptionOptionComponent,
    SelectPerkGuiComponent,
    PerkUpItemComponent,
    PerkUpRowComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
