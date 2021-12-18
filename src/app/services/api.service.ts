import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Card } from '../interfaces/card.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseURL: string;

  constructor(private http: HttpClient) {
    this.baseURL = environment.baseURL;
  }

  newMaze(maze: any) {
    return this.http.post(this.baseURL + '/api/maze', maze).toPromise();
  }

  getMaze(id: string): Promise<any> {
    return this.http.get(this.baseURL + '/api/maze/' + id).toPromise();
  }

  getAllCards(): Promise<Card[]> {
    return this.http.get<Card[]>(this.baseURL + '/api/card').toPromise();
  }

  newCard(card: Card) {
    this.http.post(this.baseURL + '/api/card', card).toPromise();
  }

  deleteCard(id: string) {
    this.http.delete(this.baseURL + '/api/card/' + id).toPromise();
  }
}
