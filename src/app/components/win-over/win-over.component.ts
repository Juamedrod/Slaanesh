import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManagerService } from 'src/app/services/manager.service';

@Component({
  selector: 'app-win-over',
  templateUrl: './win-over.component.html',
  styleUrls: ['./win-over.component.css']
})
export class WinOverComponent implements OnInit {

  matchId: string = '';

  constructor(private activatedRoute: ActivatedRoute, private managerService: ManagerService) {
    this.activatedRoute.params.subscribe(value => {
      this.matchId = value.matchId;
    })
  }

  async ngOnInit() {
    try {
      await this.managerService.deleteMatch(this.matchId);
    } catch (error) {
      console.log(error);
    }
  }
}
