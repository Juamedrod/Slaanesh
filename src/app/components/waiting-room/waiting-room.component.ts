import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerService } from 'src/app/services/manager.service';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit {

  matchId: string = '';
  userId: string = '';
  interval: any;

  constructor(private managerService: ManagerService, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.managerService.getUser()._id;
    this.scanForMatch();
  }

  showMyId() {
    this.userId = this.managerService.getUser()._id;
  }

  scanForMatch() {
    this.interval = setInterval(async () => {
      const response: any = await this.managerService.searchMatch(this.userId);
      if (response) {
        if (response.player1.userId == this.userId) {
          this.managerService.setEnemyId(response.player2.userId);
        } else {
          this.managerService.setEnemyId(response.player1.userId);
        }
        this.router.navigate(['/match', response._id]);
      }
    }, 3000);
  }

  async launchGame() {
    try {
      const response = await this.managerService.createMatch(this.userId, this.matchId);

    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
