import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { MazeComponent } from './components/maze/maze.component';
import { CardComponent } from './components/card/card.component';
import { MatchComponent } from './components/match/match.component';
import { HeaderComponent } from './components/header/header.component';
import { GenerateCardComponent } from './components/generate-card/generate-card.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component';
import { RegisterLoginComponent } from './components/register-login/register-login.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    MazeComponent,
    CardComponent,
    MatchComponent,
    HeaderComponent,
    GenerateCardComponent,
    WaitingRoomComponent,
    RegisterLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
