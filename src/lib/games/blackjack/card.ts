import { Card, CardSuit, CardRank } from '../../../types/blackjack.js';

// Card factory
export class CardFactory {
  static createCard(suit: CardSuit, rank: CardRank): Card {
    const value = this.getCardValue(rank);
    const displayName = `${rank}${suit}`;
    
    return {
      suit,
      rank,
      value,
      displayName
    };
  }

  private static getCardValue(rank: CardRank): number {
    switch (rank) {
      case CardRank.ACE:
        return 11; // For now, treat Ace as 11
      case CardRank.JACK:
      case CardRank.QUEEN:
      case CardRank.KING:
        return 10;
      default:
        return parseInt(rank);
    }
  }
}