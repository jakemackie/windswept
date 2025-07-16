import { 
	SlashCommandBuilder,

	ContainerBuilder,

  TextDisplayBuilder,

  // SeparatorBuilder,
  // SeparatorComponent,
  // SeparatorSpacingSize,

  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  ButtonInteraction
} from 'discord.js';

import type { 
	ChatInputCommandInteraction
} from 'discord.js';

import { windswept } from '../../client/windswept.js';
import { StandardDeck, BlackjackHand } from '../../lib/games/blackjack/index.js';
import type { Hand } from '../../types/blackjack.js';

// Helper function to create game display
function createGameDisplay(userHand: Hand, opponentHand: Hand, isUserTurn: boolean = true, showOpponentCards: boolean = true): string {
  const opponentDisplay = showOpponentCards 
    ? `**Opponent's Hand:** \`[${opponentHand.toString()}]\` **(${opponentHand.value})**`
    : `**Opponent's Hand:** \`[${opponentHand.cards[0].displayName}, ?]\` **(?)**`;
    
  return `**Blackjack Game**\n\n` +
         `**Your Hand:** \`[${userHand.toString()}]\` **(${userHand.value})**\n` +
         `${opponentDisplay}\n\n` +
         `${isUserTurn ? 'Your turn! Hit or Stand?' : 'Opponent\'s turn...'}`;
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

// Helper function to create new container
function createGameContainer(client: windswept, userHand: Hand, opponentHand: Hand, isUserTurn: boolean = true, showOpponentCards: boolean = true): ContainerBuilder {
  const userButtonHit = new ButtonBuilder()
    .setCustomId('user-button-hit')
    .setLabel('Hit')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(!isUserTurn);

  const userButtonStand = new ButtonBuilder()
    .setCustomId('user-button-stand')
    .setLabel('Stand')
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(!isUserTurn);

  return new ContainerBuilder()
    .setAccentColor(client.color)
    .addTextDisplayComponents(
      new TextDisplayBuilder()
        .setContent(createGameDisplay(userHand, opponentHand, isUserTurn, showOpponentCards))
    )
    .addActionRowComponents(
      new ActionRowBuilder<ButtonBuilder>().addComponents(userButtonHit, userButtonStand)
    );
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

    // Build the initial container
    const container = createGameContainer(client, userHand, opponentHand, true, false);

    const reply = await interaction.reply({
      components: [container],
      flags: [
        MessageFlags.Ephemeral,
        MessageFlags.IsComponentsV2
      ]
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
          const bustContainer = new ContainerBuilder()
            .setAccentColor(client.color)
            .addTextDisplayComponents(
              new TextDisplayBuilder()
                .setContent(createGameDisplay(newUserHand, opponentHand, false, true) + '\n\n**BUST! You lose!**')
            )
            .addActionRowComponents(
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId('user-button-hit')
                  .setLabel('Hit')
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId('user-button-stand')
                  .setLabel('Stand')
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled(true)
              )
            );
          await i.update({
            components: [bustContainer],
            flags: [MessageFlags.IsComponentsV2]
          });
          collector.stop();
          return;
        }

        // Update the display
        const newContainer = createGameContainer(client, newUserHand, opponentHand, true, false);
        await i.update({
          components: [newContainer],
          flags: [MessageFlags.IsComponentsV2]
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
        }
        
        // Determine winner
        const result = determineWinner(userHand, opponentHand);
        
        // Show final game state with all cards revealed
        const finalContainer = new ContainerBuilder()
          .setAccentColor(client.color)
          .addTextDisplayComponents(
            new TextDisplayBuilder()
              .setContent(createGameDisplay(userHand, opponentHand, false, true) + `\n\n**${result}**`)
          )
          .addActionRowComponents(
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId('user-button-hit')
                .setLabel('Hit')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId('user-button-stand')
                .setLabel('Stand')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
            )
          );
        await i.update({
          components: [finalContainer],
          flags: [MessageFlags.IsComponentsV2]
        });
        collector.stop();
      }
    });

    collector.on('end', () => {
      console.log('Blackjack game ended');
    });
  }
};
