import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManagerService } from 'src/app/services/manager.service';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.css']
})
export class GameOverComponent implements OnInit {

  matchId: string = '';

  constructor(private activatedRoute: ActivatedRoute, private managerService: ManagerService) {
    this.activatedRoute.params.subscribe(value => {
      this.matchId = value.matchId;
    })
  }

  async ngOnInit() {
    try {
      const response = await this.managerService.deleteMatch(this.matchId);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

}
