import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/interfaces/card.interface';
import { ApiService } from 'src/app/services/api.service';
import { ManagerService } from 'src/app/services/manager.service';

@Component({
  selector: 'maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.css']
})
export class MazeComponent implements OnInit {

  cards: Card[] = [];
  myMaze: Card[] = [];
  message: string = '';
  artifacts: number = 0;
  legendaries: number = 0;
  rares: number = 0;
  common: number = 0;
  filter: string = '';
  filteredCards: Card[] = [];

  constructor(private apiService: ApiService, private managerService: ManagerService) { }

  async ngOnInit() {
    try {
      this.cards = await this.apiService.getAllCards();
      this.filteredCards = this.cards;
      const response = await this.apiService.getMaze(this.managerService.getUser()._id);
      if (!response.error) {
        this.myMaze = response;
        this.extractCardTypes(this.myMaze);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async saveMaze() {
    try {
      if (this.myMaze.length < 12) {
        this.message = 'Your deck cant have less than 12 cards';
        return;
      }
      if (this.artifacts > 1 || this.legendaries > 2 || this.rares > 3) {
        this.message = 'Your deck have too many Unique types, check above to see whats going on';
        return;
      }
      const maze = { userId: this.managerService.getUser(), maze: this.myMaze }
      await this.apiService.newMaze(maze);
      this.message = 'Your deck has been saved successfully';
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  toMaze(card: Card, index: number) {
    try {
      if (this.myMaze.filter((_card: Card) => (_card._id == card._id)).length > 0) return;
      this.myMaze.push(card);
      this.extractCardTypes(this.myMaze);
    } catch (error) {
      console.log(error);
    }
  }

  toCards(card: Card, index: number) {
    try {
      this.myMaze.splice(index, 1);
      this.extractCardTypes(this.myMaze);
    } catch (error) {
      console.log(error);
    }
  }

  filterByRarity(rarity: string) {
    if (this.filter == rarity) {
      this.filteredCards = this.cards;
      this.filter = '';
      return;
    }
    this.filter = rarity;
    this.filteredCards = this.cards.filter((card: Card) => card.rarity == rarity);
  }


  extractCardTypes(arr: Card[]) {
    this.artifacts = this.howArtifacts(arr);
    this.legendaries = this.howLegendaries(arr);
    this.rares = this.howRares(arr);
    this.common = this.howCommon(arr);
  }

  howArtifacts(arr: Card[]): number {
    return arr.filter((card: Card) => {
      return card.rarity === 'artifact';
    }).length;
  }

  howLegendaries(arr: Card[]): number {
    return arr.filter((card: Card) => {
      return card.rarity === 'legendary';
    }).length;
  }

  howRares(arr: Card[]): number {
    return arr.filter((card: Card) => {
      return card.rarity === 'rare';
    }).length;
  }

  howCommon(arr: Card[]): number {
    return arr.filter((card: Card) => {
      return card.rarity === 'common';
    }).length;
  }
}
