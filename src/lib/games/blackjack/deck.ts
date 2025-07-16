import { Card, CardSuit, CardRank, Deck } from '../../../types/blackjack.js';
import { CardFactory } from './card.js';

// Deck implementation
export class StandardDeck implements Deck {
  private _cards: Card[];

  constructor() {
    this._cards = this.generateCards();
    this.shuffle();
  }

  get cards(): Card[] {
    return [...this._cards];
  }

  get remainingCards(): number {
    return this._cards.length;
  }

  drawCard(): Card | undefined {
    return this._cards.pop();
  }

  shuffle(): void {
    // Fisher-Yates shuffle
    for (let i = this._cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
    }
  }

  private generateCards(): Card[] {
    const cards: Card[] = [];
    const suits = Object.values(CardSuit);
    const ranks = Object.values(CardRank);

    for (const suit of suits) {
      for (const rank of ranks) {
        cards.push(CardFactory.createCard(suit, rank));
      }
    }

    return cards;
  }
} 