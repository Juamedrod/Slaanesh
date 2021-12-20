import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { GameOverComponent } from './components/game-over/game-over.component';
import { GenerateCardComponent } from './components/generate-card/generate-card.component';
import { HeaderComponent } from './components/header/header.component';
import { MatchComponent } from './components/match/match.component';
import { MazeComponent } from './components/maze/maze.component';
import { RegisterLoginComponent } from './components/register-login/register-login.component';
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component';
import { WinOverComponent } from './components/win-over/win-over.component';
import { LoggedGuard } from './Guards/logged.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/maze' },
  { path: 'home', redirectTo: '/maze' },
  { path: 'new', component: GenerateCardComponent },
  { path: 'new/:cardId', component: GenerateCardComponent },
  { path: 'maze', component: MazeComponent, canActivate: [LoggedGuard] },
  { path: 'waiting', component: WaitingRoomComponent, canActivate: [LoggedGuard] },
  { path: 'match/:matchId', component: MatchComponent, canActivate: [LoggedGuard] },
  { path: 'registerlogin', component: RegisterLoginComponent },
  { path: 'gameover/:matchId', component: GameOverComponent },
  { path: 'winover/:matchId', component: WinOverComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
