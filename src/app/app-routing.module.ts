import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { GenerateCardComponent } from './components/generate-card/generate-card.component';
import { HeaderComponent } from './components/header/header.component';
import { MatchComponent } from './components/match/match.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: GenerateCardComponent },
  { path: 'new', component: GenerateCardComponent },
  { path: 'match', component: MatchComponent },
  { path: '**', redirectTo: '' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
