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

  constructor(private apiService: ApiService, private managerService: ManagerService) { }

  async ngOnInit() {
    try {
      this.cards = await this.apiService.getAllCards();
      const response = await this.apiService.getMaze(this.managerService.getUser()._id);
      if (!response.error) {
        this.myMaze = response;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async saveMaze() {
    try {
      const maze = { userId: this.managerService.getUser(), maze: this.myMaze }
      await this.apiService.newMaze(maze);
    } catch (error) {
      console.log(error);
    }
  }

  toMaze(card: Card, index: number) {
    try {
      this.myMaze.push(card);
      this.cards.splice(index, 1);
    } catch (error) {
      console.log(error);
    }
  }

  toCards(card: Card, index: number) {
    try {
      this.cards.push(card);
      this.myMaze.splice(index, 1);
    } catch (error) {
      console.log(error);
    }
  }
}
