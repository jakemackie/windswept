import {
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags
} from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
  data: {
    name: 'splash',
    description: 'Fetch the server\'s splash screen'
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;

    const splashURL = guild?.splashURL({ size: 4096, extension: 'png' });
    if (!splashURL) {
      return interaction.reply({
        content: 'This server does not have a splash screen.',
        flags: MessageFlags.Ephemeral
      });
    }

    const container = new ContainerBuilder();
    const mediaGallery = new MediaGalleryBuilder()
      .addItems(new MediaGalleryItemBuilder()
        .setURL(splashURL)
        .setDescription(`${guild?.name || 'Unknown Server'} Splash Screen`)
      );

    container.addMediaGalleryComponents(mediaGallery);

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
