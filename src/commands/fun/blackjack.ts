import { 
	SlashCommandBuilder,

  // SeparatorBuilder,
  // SeparatorComponent,
  // SeparatorSpacingSize,

  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  EmbedBuilder
} from 'discord.js';

import type { 
	ChatInputCommandInteraction
} from 'discord.js';

import { windswept } from '../../client/windswept.js';
import { StandardDeck, BlackjackHand } from '../../lib/games/blackjack/index.js';
import type { Hand, Card } from '../../types/blackjack.js';
import emotes from './emotes.js';

// Helper to get emote for a card
function getCardEmote(card: Card): string {
  // Map suit and rank enums to emotes.json keys
  const suitMap: Record<string, string> = {
    '♣': 'clubs',
    '♠': 'spades',
    '♦': 'diamonds',
    '♥': 'hearts',
  };
  const rankMap: Record<string, string> = {
    'A': 'ace',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine',
    '10': 'ten',
    'J': 'jack',
    'Q': 'queen',
    'K': 'king',
  };
  const suitKey = suitMap[card.suit];
  const rankKey = rankMap[card.rank];
  // Only clubs, spades, diamonds are in emotes.json
  if (suitKey && (emotes as any)[suitKey] && (emotes as any)[suitKey][rankKey]) {
    return (emotes as any)[suitKey][rankKey];
  }
  // fallback for hearts or missing emote
  return '❓';
}

// Helper to display a hand as emotes
function handToEmotes(hand: Hand): string {
  return hand.cards.map(getCardEmote).join(' ');
}

// Bot AI logic
function shouldBotHit(hand: Hand): boolean {
  const value = hand.value;
  
  // Always hit if below 15
  if (value < 15) return true;
  
  // At 15 or above, 50/50 chance to hit one more time
  if (value >= 15 && value < 21) {
    return Math.random() < 0.5;
  }
  
  // Stand at 21 or above
  return false;
}

// Determine winner
function determineWinner(userHand: Hand, opponentHand: Hand): string {
  const userValue = userHand.value;
  const opponentValue = opponentHand.value;
  
  // Check for busts first
  if (userHand.isBust && opponentHand.isBust) return "Both bust! It's a tie!";
  if (userHand.isBust) return "You bust! You lose!";
  if (opponentHand.isBust) return "Opponent busts! You win!";
  
  // Check for blackjack
  if (userHand.isBlackjack && opponentHand.isBlackjack) return "Both have blackjack! It's a tie!";
  if (userHand.isBlackjack) return "Blackjack! You win!";
  if (opponentHand.isBlackjack) return "Opponent has blackjack! You lose!";
  
  // Compare values
  if (userValue > opponentValue) return "You win!";
  if (userValue < opponentValue) return "You lose!";
  return "It's a tie!";
}

// Helper to create the blackjack embed
function createBlackjackEmbed(client: windswept, userHand: Hand, opponentHand: Hand, isUserTurn: boolean = true, showOpponentCards: boolean = true, result?: string): EmbedBuilder {
  // Get the first card's value
  const firstCard = opponentHand.cards[0];
  const firstCardValue = firstCard ? firstCard.value : '?';
  let opponentCardsLine: string;
  let opponentValueLine: string;
  if (showOpponentCards) {
    opponentCardsLine = `**${handToEmotes(opponentHand)}**`;
    opponentValueLine = `(${opponentHand.value})`;
  } else {
    opponentCardsLine = `**${getCardEmote(firstCard)} <:windswept_blackjack_z_card:1395299740433911838>**`;
    opponentValueLine = `(${firstCardValue} + ?)`;
  }
  const description =
    `__**Opponent's Hand**__\n` +
    `# ${opponentCardsLine.replace('**','').replace('**','')}\n` +
    `${opponentValueLine}\n\n` +
    `__**Your Hand**__\n` +
    `# ${handToEmotes(userHand)}\n` +
    `(${userHand.value})`;

  // Determine color: green for win, red for loss, yellow for tie, default to client.color
  let color = client.color;
  if (result) {
    if (result.toLowerCase().includes('win')) color = 0x2ecc71; // green
    else if (result.toLowerCase().includes('lose')) color = 0xe74c3c; // red
    else if (result.toLowerCase().includes('tie')) color = 0xf1c40f; // yellow
  }

  return new EmbedBuilder()
    .setColor(color)
    .setTitle('Blackjack Game')
    .setDescription(description)
    .setFooter({ text: isUserTurn ? 'Your turn! Hit or Stand?' : "Opponent's turn..." });
}

// Helper to create the action row with buttons
function createBlackjackButtons(isUserTurn: boolean = true) {
  return [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('user-button-hit')
        .setLabel('Hit')
        .setStyle(ButtonStyle.Success)
        .setDisabled(!isUserTurn),
      new ButtonBuilder()
        .setCustomId('user-button-stand')
        .setLabel('Stand')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!isUserTurn)
    )
  ];
}

export default {
	name: 'blackjack',
	data: new SlashCommandBuilder()
    .setName('blackjack')
    .setDescription('Play blackjack either with the bot or with another player.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to play with.')
        .setRequired(false)
    ),

  // dev-notes:
  /*
    - The user can play blackjack with the bot or with another player.
    - If the user plays with the bot, the messages can be shown in the channel or in a DM.
    - If the user plays with another player, the messages must be ephemeral to not the reveal the opposing players hand.

  */

	async execute(interaction: ChatInputCommandInteraction) {
		const client = interaction.client as windswept;
    // const user = interaction.options.getUser('user');

    // Create and shuffle deck
    const deck = new StandardDeck();
    
    // Deal initial cards
    let userHand = new BlackjackHand([deck.drawCard()!]);
    let opponentHand = new BlackjackHand([deck.drawCard()!]);

    // Build the initial embed and buttons
    const embed = createBlackjackEmbed(client, userHand, opponentHand, true, false);
    const buttons = createBlackjackButtons(true);

    const reply = await interaction.reply({
      embeds: [embed],
      components: buttons
    });

    // Set up button interaction collector
    const collector = reply.createMessageComponentCollector({
      time: 300000 // 5 minutes
    });

    collector.on('collect', async (i: ButtonInteraction) => {
      if (i.user.id !== interaction.user.id) {
        await i.reply({ content: 'This is not your game!', ephemeral: true });
        return;
      }

      if (i.customId === 'user-button-hit') {
        // Add a new card to user's hand
        const drawnCard = deck.drawCard();
        if (!drawnCard) {
          await i.reply({ content: 'No cards left in deck!', ephemeral: true });
          return;
        }
        
        const newUserHand = userHand.addCard(drawnCard);
        
        // Update the user hand for next interactions
        userHand = newUserHand as BlackjackHand;
        
        // Check if bust
        if (newUserHand.isBust) {
          // Show final game state with opponent cards revealed
          const bustEmbed = createBlackjackEmbed(client, newUserHand, opponentHand, false, true, 'You bust! You lose!');
          const disabledButtons = createBlackjackButtons(false);
          bustEmbed.setFooter({ text: 'BUST! You lose!' });
          await i.update({
            embeds: [bustEmbed],
            components: disabledButtons
          });
          collector.stop();
          return;
        }
        // Update the display
        const newEmbed = createBlackjackEmbed(client, newUserHand, opponentHand, true, false);
        await i.update({
          embeds: [newEmbed],
          components: createBlackjackButtons(true)
        });

      } else if (i.customId === 'user-button-stand') {
        // User stands, now it's the bot's turn
        let currentOpponentHand = opponentHand;
        
        // Bot plays its turn
        while (shouldBotHit(currentOpponentHand)) {
          const drawnCard = deck.drawCard();
          if (!drawnCard) break;
          
          currentOpponentHand = currentOpponentHand.addCard(drawnCard) as BlackjackHand;
          
          // Update opponent hand
          opponentHand = currentOpponentHand;

          // If opponent busts, end game immediately
          if (currentOpponentHand.isBust) {
            const result = determineWinner(userHand, opponentHand);
            const finalEmbed = createBlackjackEmbed(client, userHand, opponentHand, false, true, result);
            finalEmbed.setFooter({ text: result });
            await i.update({
              embeds: [finalEmbed],
              components: createBlackjackButtons(false)
            });
            collector.stop();
            return;
          }
        }
        // Determine winner (if not already ended by bust)
        const result = determineWinner(userHand, opponentHand);
        const finalEmbed = createBlackjackEmbed(client, userHand, opponentHand, false, true, result);
        finalEmbed.setFooter({ text: result });
        await i.update({
          embeds: [finalEmbed],
          components: createBlackjackButtons(false)
        });
        collector.stop();
      }
    });

    collector.on('end', () => {
      console.log('Blackjack game ended');
    });
  }
};
