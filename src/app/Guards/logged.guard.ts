import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ManagerService } from '../services/manager.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(private managerService: ManagerService, private router: Router) { }

  canActivate() {
    if (this.managerService.getUser().id == '') {
      this.router.navigate(['/registerlogin']);
      return false;
    }
    return true;
  }

}
