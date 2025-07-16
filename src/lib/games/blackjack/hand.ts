import { Card, Hand } from '../../../types/blackjack.js';

// Hand implementation
export class BlackjackHand implements Hand {
  private _cards: Card[];

  constructor(cards: Card[] = []) {
    this._cards = [...cards];
  }

  get cards(): Card[] {
    return [...this._cards];
  }

  get value(): number {
    return this._cards.reduce((sum, card) => sum + card.value, 0);
  }

  get isBust(): boolean {
    return this.value > 21;
  }

  get isBlackjack(): boolean {
    return this._cards.length === 2 && this.value === 21;
  }

  addCard(card: Card): Hand {
    return new BlackjackHand([...this._cards, card]);
  }

  toString(): string {
    return this._cards.map(card => card.displayName).join(', ');
  }
} 