import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/interfaces/card.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-generate-card',
  templateUrl: './generate-card.component.html',
  styleUrls: ['./generate-card.component.css']
})
export class GenerateCardComponent implements OnInit {
  newCard: Card;

  constructor(private apiService: ApiService) {
    this.newCard = {
      avatar: '',
      cardName: '',
      cardQuote: '',
      cardType: '',
      defense: 0,
      attack: 0,
      lives: 0,
    }
  }

  ngOnInit(): void {
  }

  async onSave() {
    try {
      console.log(this.newCard);

      const response = await this.apiService.newCard(this.newCard);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
}
