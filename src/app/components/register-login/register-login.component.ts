import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManagerService } from 'src/app/services/manager.service';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.css']
})
export class RegisterLoginComponent implements OnInit {

  newUser: any;
  loginMail: any;
  loginPass: any;

  constructor(private managerService: ManagerService, private router: Router) {
    this.newUser = {
      name: 'name',
      email: 'email',
      password: 'password',
    }
  }

  ngOnInit(): void {
  }

  async register() {
    const user = await this.managerService.createUser(this.newUser);
    this.managerService.setUser(user);
    this.managerService.logged(true);
    this.router.navigate(['/new']);
  }

  async login() {
    const user: any = await this.managerService.login({ email: this.loginMail, password: this.loginPass });
    if (user.error) return '';
    this.managerService.setUser(user);
    this.managerService.logged(true);
    console.log(user);
    this.router.navigate(['/new']);
    return '';
  }

}
