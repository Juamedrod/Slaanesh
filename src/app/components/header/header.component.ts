import { Component, OnInit } from '@angular/core';
import { ManagerService } from 'src/app/services/manager.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  logged: boolean = false;

  constructor(private managerService: ManagerService) { }

  ngOnInit() {
    this.managerService.loginSuscribe().subscribe((logged) => {
      this.logged = logged;
    });
  }


}
