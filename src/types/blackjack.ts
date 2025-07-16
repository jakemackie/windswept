// Card system enums and types
export enum CardSuit {
  SPADES = '♠',
  HEARTS = '♥',
  DIAMONDS = '♦',
  CLUBS = '♣'
}

export enum CardRank {
  ACE = 'A',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K'
}

export interface Card {
  readonly suit: CardSuit;
  readonly rank: CardRank;
  readonly value: number;
  readonly displayName: string;
}

export interface Deck {
  readonly cards: Card[];
  readonly remainingCards: number;
  drawCard(): Card | undefined;
  shuffle(): void;
}

export interface Hand {
  readonly cards: Card[];
  readonly value: number;
  readonly isBust: boolean;
  readonly isBlackjack: boolean;
  addCard(card: Card): Hand;
  toString(): string;
} 