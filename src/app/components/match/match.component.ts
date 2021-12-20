import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/interfaces/card.interface';
import { ApiService } from 'src/app/services/api.service';
import { io } from "socket.io-client";
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
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
  message: string = '';
  displayedMessage: string = '';

  /**
   * MATCH STATE VARIABLES 
   * 0=WAITING
   * 1=YOUR TURN
   * 2=ENEMY TURN
   */
  matchState: number = 0;
  userId: string = '';
  enemyId: string = '';
  activeCardIndex: number = 0;
  activeCardEnemyIndex: number = 0;

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private router: Router, private managerService: ManagerService) {
    this.socket = io(environment.baseURL);
    this.activatedRoute.params.subscribe(value => {
      this.matchId = value.matchId;
    })
    this.userPlayer = {
      activeCards: [],
    }
    this.enemyPlayer = {
      activeCards: [],
    }
    this.userId = (this.managerService.getUser())._id;
    this.enemyId = this.managerService.getEnemyId();

  }

  async ngOnInit() {
    this.match = await this.managerService.getMatchById(this.matchId);
    this.updateMatch();
    this.socket.on("connect", () => {
      this.socket.emit('join', { matchId: this.matchId });
    });

    this.socket.on("recieveAction", (data: any) => {
      this.round = data.round;
      this.displayedMessage = data.message;
      this.message = '';
      console.log(data);
      this.updateMatch();
    });
  }

  async executeAction() {
    try {
      this.performAction();
      this.match.userActiveturn = this.enemyId;
      await this.managerService.updateMatch(this.match);
      this.round++;
      this.activeCard = undefined;
      this.enemyActiveCard = undefined;
      this.socket.emit('ActionPerformed', { matchId: this.matchId, round: this.round, message: this.message });
    } catch (error) {
      console.log(error);
    }
  }

  performAction() {
    /**
     * You can sacrifice one of your card to discard an enemy event card, both cards die
     */
    if (this.enemyActiveCard?.cardType == 'Attack Event' || this.enemyActiveCard?.cardType == 'Defense Event') {
      this.eraseCard();
      this.eraseMyCard();
      this.message = `${this.activeCard?.cardName} sacrificed itself to destroy ${this.enemyActiveCard.cardName}`;
      this.shiftCards();
      return
    }

    switch (this.activeCard?.cardType) {
      case 'Attack Event':
        for (let card of this.enemyPlayer.activeCards) {
          if (card.cardType == 'Attack Event' || card.cardType == 'Defense Event') continue;
          card.defense -= this.activeCard.defense;
          card.lives -= this.activeCard.attack;
        }
        this.activeCard.lives = 0;
        this.eraseCard();
        this.eraseMyCard();
        this.message = `${this.activeCard?.cardName} invoked its power vs the enemy team`;
        break;

      case 'Defense Event':
        for (let card of this.userPlayer.activeCards) {
          if (card._id == this.activeCard._id) continue;
          card.attack += this.activeCard.attack;
          card.defense += this.activeCard.defense;
          card.lives += this.activeCard.lives;
        }
        this.activeCard.lives = 0;
        this.eraseMyCard();
        this.message = `${this.activeCard?.cardName} invoked its power to boost its Allies, surge of Power!`;
        break;

      case 'character'://cartas character reciben un punto menos de daño que otras criaturas pero siempre reciben al menos 1 al ser atacados
        let dmg = (this.activeCard.attack - this.enemyActiveCard?.defense!);
        if (this.enemyActiveCard?.cardType == 'character') {
          dmg--;
          (dmg <= 0) ? (this.enemyActiveCard!.lives -= 1) : (this.enemyActiveCard!.lives -= dmg);
        } else {
          (dmg <= 0) ? 0 : (this.enemyActiveCard!.lives -= dmg);
        }
        if (this.enemyActiveCard!.lives <= 0) {
          this.eraseCard();
        }
        this.message = `${this.activeCard?.cardName} attacked ${this.enemyActiveCard!.cardName} inflicting ${dmg < 0 ? '0' : dmg} damage and ${(this.enemyActiveCard!.lives <= 0) ? 'DIED' : 'SURVIVED'}`;
        break;

      case 'creature'://pueden evitar el daño si tienen mas defensa o igual que el ataque del enemigo
        let dmg2 = (this.activeCard.attack - this.enemyActiveCard?.defense!);
        if (this.enemyActiveCard?.cardType == 'creature') {
          (dmg2 <= 0) ? 0 : (this.enemyActiveCard!.lives -= dmg2);
        } else {
          dmg2--;
          (dmg2 <= 0) ? this.enemyActiveCard!.lives -= 1 : (this.enemyActiveCard!.lives -= dmg2);
        }

        if (this.enemyActiveCard!.lives <= 0) this.eraseCard();

        this.message = `${this.activeCard?.cardName} attacked ${this.enemyActiveCard!.cardName} inflicting ${dmg2 < 0 ? '0' : dmg2} damage and ${(this.enemyActiveCard!.lives <= 0) ? 'DIED' : 'SURVIVED'}`;
        break;

      default:
        break;
    }

    this.shiftCards();

  }

  /**
       * shift cards and get a new one to complete active desk of 6
       */
  shiftCards() {
    while (this.enemyPlayer.activeCards.length < 6 && this.enemyPlayer.maze.length > 0) {
      const randomNum = Math.trunc(Math.random() * this.enemyPlayer.maze.length);
      this.enemyPlayer.activeCards.push(this.enemyPlayer.maze[randomNum]);
      this.enemyPlayer.maze.splice(randomNum, 1);
    }
    while (this.userPlayer.activeCards.length < 6 && this.userPlayer.maze.length > 0) {
      const randomNum = Math.trunc(Math.random() * this.userPlayer.maze.length);
      this.userPlayer.activeCards.push(this.userPlayer.maze[randomNum]);
      this.userPlayer.maze.splice(randomNum, 1);
    }
  }

  eraseCard() {
    for (const card of this.enemyPlayer.activeCards) {
      if (card.lives <= 0) this.enemyPlayer.maze.splice(this.enemyPlayer.maze.findIndex((element: Card) => element._id == card._id), 1);
    }

    this.enemyPlayer.activeCards = this.enemyPlayer.activeCards.filter((card: Card) => {
      return card.lives > 0;
    });
  }

  eraseMyCard() {
    for (const card of this.userPlayer.activeCards) {
      if (card.lives < 0) this.userPlayer.maze.splice(this.userPlayer.maze.findIndex((element: Card) => element._id == card._id), 1);
    }

    this.userPlayer.activeCards = this.userPlayer.activeCards.filter((card: Card) => {
      return card.lives > 0;
    });
  }

  async updateMatch() {
    try {
      this.match = await this.managerService.getMatchById(this.matchId);

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
      if (this.userPlayer.maze.length == 0 && this.userPlayer.activeCards.length == 0) {
        //game over, you loose
        console.log('game over');
        this.router.navigate(['/gameover/', this.matchId]);
      }

      if (this.enemyPlayer.maze.length == 0 && this.enemyPlayer.activeCards.length == 0) {
        //game over, you win
        console.log('game over');
        this.router.navigate(['/winover/', this.matchId]);
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

  onEnemyIndex(index: number) {
    this.activeCardEnemyIndex = index;
  }

  onUserIndex(index: number) {
    this.activeCardIndex = index;
  }

  toggleHide() {
    this.isActionHidden = !this.isActionHidden;
  }

  ngOnDestroy() {
    this.socket.emit('forceDisconnect');
  }

}
