import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/interfaces/card.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  ownMaze: Card[] = [];
  enemyMaze: Card[] = [];
  activeCard?: Card;
  enemyActiveCard?: Card;
  isActionHidden: boolean = true;

  constructor(private apiService: ApiService) {

  }

  async ngOnInit() {
    this.ownMaze = await this.apiService.getAllCards();
  }

  setEnemyActiveCard(card: Card) {
    this.enemyActiveCard = card;
  }

  setActiveCard(card: Card) {
    this.activeCard = card;
  }

  toggleHide(){
    this.isActionHidden=!this.isActionHidden;
  }

}
