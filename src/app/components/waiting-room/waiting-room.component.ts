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
      const response = await this.managerService.searchMatch(this.userId);
      //TODO Aquí recibo el id del match para pasarlo y hacer la logica de la batalla!
      if (response) {
        this.router.navigate(['/match']);
      }
    }, 3000);
  }

  async launchGame() {
    try {
      const response = await this.managerService.createMatch(this.userId, this.matchId);
      this.router.navigate(['/match']);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
