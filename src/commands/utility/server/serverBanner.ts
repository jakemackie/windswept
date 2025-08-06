import {
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  type ChatInputCommandInteraction
} from 'discord.js';

export default {
  data: {
    name: 'banner',
    description: 'Fetch the server\'s banner'
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    const bannerURL = guild?.bannerURL({ size: 4096, extension: 'png' });

    if (!bannerURL) return interaction.reply('This server does not have a banner.');

    const container = new ContainerBuilder();
    const mediaGallery = new MediaGalleryBuilder()
      .addItems(new MediaGalleryItemBuilder()
        .setURL(bannerURL || '')
        .setDescription(`${guild?.name || 'Unknown Server'} Banner`)
      );

    container.addMediaGalleryComponents(mediaGallery);

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
