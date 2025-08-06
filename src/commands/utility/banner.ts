import { 
  SlashCommandBuilder,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  type ChatInputCommandInteraction
} from 'discord.js';

export default {
  name: 'banner',
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('Fetch the banner of the specified user, defaults to self')
    .addUserOption(option => option
      .setName('user')
      .setDescription('The user to fetch the banner of')
      .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;
    // Fetch the full user object to ensure banner is available
    const fullUser = await interaction.client.users.fetch(user.id, { force: true });
    const bannerUrl = fullUser.bannerURL({ size: 1024 });

    if (!bannerUrl) {
      return await interaction.reply({
        content: `${user.username} does not have a banner.`,
        flags: MessageFlags.Ephemeral
      });
    }

    const container = new ContainerBuilder();
    const mediaGallery = new MediaGalleryBuilder()
      .addItems(new MediaGalleryItemBuilder()
        .setURL(bannerUrl)
        .setDescription(`The banner of ${user.username}`)
      );

    container.addMediaGalleryComponents(mediaGallery);

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
