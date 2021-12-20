import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'src/app/interfaces/card.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-generate-card',
  templateUrl: './generate-card.component.html',
  styleUrls: ['./generate-card.component.css']
})
export class GenerateCardComponent implements OnInit {

  newCard!: Card;
  cardId?: string = 'empty';

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(value => {
      this.cardId = value.cardId;
    });

    this.newCard = {
      avatar: '',
      cardName: '',
      cardQuote: '',
      cardType: '',
      defense: 0,
      attack: 0,
      lives: 0,
      rarity: ''
    }
  }

  async ngOnInit() {
    if (this.cardId != '') {
      try {
        const response = await this.apiService.getCardById(this.cardId!);
        this.newCard = response;
      } catch (error) {
        console.log(error);
      }
    }
  }

  async onSave() {
    try {
      const response = await this.apiService.newCard(this.newCard);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  async onEdit() {
    try {
      const response = await this.apiService.updateCardById(this.cardId!, this.newCard);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
}
