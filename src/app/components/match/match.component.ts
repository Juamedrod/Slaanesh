import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/interfaces/card.interface';
import { ApiService } from 'src/app/services/api.service';
import { io } from "socket.io-client";
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ManagerService } from 'src/app/services/manager.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {
  matchId: string = 'testId';
  match: any;
  userPlayer: any;
  enemyPlayer: any;
  activeCard?: Card;
  enemyActiveCard?: Card;
  isActionHidden: boolean = true;
  socket: any;
  round: number = 0;

  /**
   * MATCH STATE VARIABLES 
   * 0=WAITING
   * 1=YOUR TURN
   * 2=ENEMY TURN
   */
  userId: string = '';
  enemyId: string = '';
  matchState: number = 0;

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private managerService: ManagerService) {
    this.socket = io(environment.baseURL);
    this.activatedRoute.params.subscribe(value => {
      this.matchId = value.matchId;
    })
    this.userId = (this.managerService.getUser())._id;
    this.enemyId = this.managerService.getEnemyId();
  }

  async ngOnInit() {
    this.updateMatch();

    this.socket.on("connect", () => {
      this.socket.emit('join', { matchId: this.matchId });
    });

    this.socket.on("recieveAction", (data: any) => {
      this.round = data.round;
      console.log(data);
      this.updateMatch();
    });
  }

  async executeAction() {

    //TODO aqui va la logica que resuleve el combate
    this.managerService.updateMatch(this.match);
    this.round++;
    this.socket.emit('ActionPerformed', { matchId: this.matchId, round: this.round });
  }

  performAction(action: string) {
    /*  activeCard?: Card;
   enemyActiveCard?: Card; */
    switch (this.activeCard?.cardType) {
      case 'Attack Event':
        for (let card of this.enemyPlayer.activeCard) {
          card.attack -= this.activeCard.attack;
          card.defense -= this.activeCard.defense;
          card.lives -= this.activeCard.lives;
        }
        break;

      case 'Defense Event':
        for (let card of this.userPlayer.activeCard) {
          card.attack += this.activeCard.attack;
          card.defense += this.activeCard.defense;
          card.lives += this.activeCard.lives;
        }
        break;

      case 'character'://cartas character reciben un punto menos de daño que otras criaturas pero siempre reciben al menos 1 al ser atacados
        const dmg = (this.activeCard.attack - this.enemyActiveCard?.defense!);
        if (this.enemyActiveCard?.cardType == 'character') {
          (dmg <= 0) ? (this.enemyActiveCard!.lives -= 1) : (this.enemyActiveCard!.lives -= (dmg - 1));
        }
        (dmg <= 0) ? 0 : (this.enemyActiveCard!.lives -= dmg);
        if (this.enemyActiveCard!.lives <= 0) {
          this.eraseCard(this.enemyActiveCard!._id!);
        }
        break;

      case 'creature'://pueden evitar el daño si tienen mas defensa o igual que el ataque del enemigo
        const dmg2 = (this.activeCard.attack - this.enemyActiveCard?.defense!);
        if (this.enemyActiveCard?.cardType == 'creature') {
          (dmg2 <= 0) ? 0 : (this.enemyActiveCard!.lives -= dmg2);
        }
        (dmg2 <= 0) ? this.enemyActiveCard!.lives -= 1 : (this.enemyActiveCard!.lives -= dmg2);
        if (this.enemyActiveCard!.lives <= 0) {
          this.eraseCard(this.enemyActiveCard!._id!);
        }
        break;

      default:
        break;
    }
  }

  eraseCard(id: string) {
    this.enemyPlayer.maze.splice(this.enemyPlayer.maze.findIndex((element: any) => element._id == id), 1);
    this.enemyPlayer.activeCard.splice(this.enemyPlayer.activeCard.findIndex((element: any) => element._id == id), 1);
  }

  async updateMatch() {
    try {
      this.match = await this.managerService.getMatchById(this.matchId);
      console.log(this.match);

      /**
       * Load the match into the local variables
       */
      if (this.match.player1.userId == this.userId) {
        this.userPlayer = this.match.player1;
        this.enemyPlayer = this.match.player2;
      } else {
        this.userPlayer = this.match.player2;
        this.enemyPlayer = this.match.player1;
      }

      /**
      * is gameOver?
      */
      if (this.userPlayer.maze.length == 0 && this.userPlayer.activeCard.length == 0) {
        //game over, you loose
        console.log('game over');
      }

      if (this.enemyPlayer.maze.length == 0 && this.enemyPlayer.activeCard.length == 0) {
        //game over, you win
        console.log('game over');
      }

      /**
       * Turn assigment
       */
      if (this.match.userActiveturn == this.userId) {
        this.matchState = 1;
      } else {
        this.matchState = 2;
      }
    } catch (error) {
      console.log(error);
    }
  }

  setEnemyActiveCard(card: Card) {
    this.enemyActiveCard = card;
  }

  setActiveCard(card: Card) {
    this.activeCard = card;
  }

  toggleHide() {
    this.isActionHidden = !this.isActionHidden;
  }

  ngOnDestroy() {
    this.socket.emit('forceDisconnect');
  }

}
