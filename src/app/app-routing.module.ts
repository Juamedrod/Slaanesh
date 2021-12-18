import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { GenerateCardComponent } from './components/generate-card/generate-card.component';
import { HeaderComponent } from './components/header/header.component';
import { MatchComponent } from './components/match/match.component';
import { MazeComponent } from './components/maze/maze.component';
import { RegisterLoginComponent } from './components/register-login/register-login.component';
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component';
import { LoggedGuard } from './Guards/logged.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: GenerateCardComponent, canActivate: [LoggedGuard] },
  { path: 'new', component: GenerateCardComponent, canActivate: [LoggedGuard] },
  { path: 'maze', component: MazeComponent, canActivate: [LoggedGuard] },
  { path: 'waiting', component: WaitingRoomComponent, canActivate: [LoggedGuard] },
  { path: 'match', component: MatchComponent, canActivate: [LoggedGuard] },
  { path: 'registerlogin', component: RegisterLoginComponent },
  { path: '**', redirectTo: '' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
