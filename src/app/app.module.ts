import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './component/map/map.component';
import { GuiComponent } from './component/gui/gui.component';
import { DescriptionComponent } from './component/description/description.component';
import { DescriptionOptionsComponent } from './component/description-options/description-options.component';
import { PartyComponent } from './component/party/party.component';
import { PartyMemberComponent } from './component/party-member/party-member.component';
import { CharacterUserComponent } from './component/character-user/character-user.component';
import { StatusIconComponent } from './component/status-icon/status-icon.component';
import { OverrideCssVarDirective } from './directive/override-css-var.directive';
import { CharacterStatComponent } from './component/character-stat/character-stat.component';
import { TabMenuComponent } from './component/tab-menu/tab-menu.component';
import { ShopInterfaceComponent } from './component/shop/shop-interface/shop-interface.component';
import { ShopItemComponent } from './component/shop/shop-item/shop-item.component';
import { NumberSpinnerComponent } from './component/number-spinner/number-spinner.component';
import { ShopDataComponentComponent } from './component/shop/shop-data-component/shop-data-component.component';
import { ShopSaleComponentComponent } from './component/shop/shop-sale-component/shop-sale-component.component';
import { ShopDataItemComponent } from './component/shop/shop-data-item/shop-data-item.component';


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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
