import { 
	SlashCommandBuilder,

	ContainerBuilder,

  // SeparatorBuilder,
  // SeparatorComponent,
  // SeparatorSpacingSize,

  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags
} from 'discord.js';

import type { 
	ChatInputCommandInteraction
} from 'discord.js';

import { windswept } from '../../client/windswept.js';

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
    const user = interaction.options.getUser('user');

    // Just to remove unused variables warning.
    console.log(client, user);

    // Inside container buttons (user vs opponent whether it be the bot or player)
    const userButtonHit = new ButtonBuilder()
      .setCustomId('user-button-hit')
      .setLabel('Hit')
      .setStyle(ButtonStyle.Primary);

    const userButtonStand = new ButtonBuilder()
      .setCustomId('user-button-stand')
      .setLabel('Stand')
      .setStyle(ButtonStyle.Secondary);

    // Build the container (components v2)

    const container = new ContainerBuilder()
      .setAccentColor(client.color)
      .addActionRowComponents(
        new ActionRowBuilder<ButtonBuilder>().addComponents(userButtonHit, userButtonStand)
      );

    await interaction.reply({
      components: [container],
      flags: [
        MessageFlags.Ephemeral,
        MessageFlags.IsComponentsV2
      ]
    });
  }
};
