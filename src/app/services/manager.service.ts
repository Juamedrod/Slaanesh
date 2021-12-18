import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Action } from '../interfaces/action.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  user: any;
  enemyId: string = '';
  baseURL: string;
  login$: Subject<boolean>
  constructor(private http: HttpClient) {
    this.baseURL = environment.baseURL;
    this.user = {
      id: ''
    }
    this.login$ = new Subject();
  }

  executeAction(action: Action) {

  }

  createMatch(player1Id: string, player2Id: string) {
    return this.http.post(this.baseURL + '/api/match/new', { player1Id, player2Id }).toPromise();
  }

  updateMatch(match: any) {
    return this.http.put(this.baseURL + '/api/match', match).toPromise();
  }

  getMatchById(id: string) {
    return this.http.get(this.baseURL + '/api/match/?id=' + id).toPromise();
  }

  searchMatch(id: string) {
    return this.http.get(this.baseURL + '/api/match/' + id).toPromise();
  }

  createUser(user: any) {
    return this.http.post(this.baseURL + '/api/users/register', user).toPromise();
  }

  login(user: any) {
    return this.http.post(this.baseURL + '/api/users/login', { email: user.email, password: user.password }).toPromise();
  }

  loginSuscribe() {
    return this.login$.asObservable();
  }

  logged(logged: boolean) {
    this.login$.next(logged);
  }

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  setEnemyId(enemyId: string) {
    this.enemyId = enemyId;
  }

  getEnemyId() {
    return this.enemyId;
  }
}
