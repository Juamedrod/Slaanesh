import { Injectable } from '@angular/core';
import { Card } from '../interfaces/card.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  maze: Card[] = [];

  constructor() { }
}
