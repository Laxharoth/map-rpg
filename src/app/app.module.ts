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


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    GuiComponent,
    DescriptionComponent,
    DescriptionOptionsComponent,
    PartyComponent,
    PartyMemberComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
