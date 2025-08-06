import {
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  type ChatInputCommandInteraction
} from 'discord.js';

export default {
  data: {
    name: 'avatar',
    description: 'Fetch the server\'s avatar'
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;

    const container = new ContainerBuilder();
    const mediaGallery = new MediaGalleryBuilder()
      .addItems(new MediaGalleryItemBuilder()
        .setURL(guild?.iconURL({ size: 4096, extension: 'png' }) || '')
        .setDescription(`${guild?.name || 'Unknown Server'} Avatar`)
      );

    container.addMediaGalleryComponents(mediaGallery);

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
