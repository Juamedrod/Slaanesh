import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/interfaces/card.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Output() activeCard: EventEmitter<Card>;
  @Output() index: EventEmitter<number>;
  @Input() maze!: Card[];


  constructor() {
    this.activeCard = new EventEmitter();
    this.index = new EventEmitter();
  }

  ngOnInit(): void {
  }

  onActiveCard(card: Card, index: number) {
    this.activeCard.emit(card);
    this.index.emit(index);
  }

}
