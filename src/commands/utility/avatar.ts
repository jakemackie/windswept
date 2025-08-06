import { 
  SlashCommandBuilder,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  type ChatInputCommandInteraction
} from 'discord.js';

export default {
	name: 'avatar',
	data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Fetch the avatar of the specified user, defaults to self')
    .addUserOption(option => option
      .setName('user')
      .setDescription('The user to fetch the avatar of')
      .setRequired(false)
    )
    .addStringOption(option => option
      .setName('type')
      .setDescription('Choose between the user\'s server avatar (if they have one) or their user avatar')
      .addChoices(
        { name: 'Server Avatar', value: 'server' },
        { name: 'User Avatar', value: 'user' })
    )
    .addStringOption(option => option
      .setName('size')
      .setDescription('The size of the avatar to fetch')
      .addChoices(
        { name: 'Small', value: '1024' },
        { name: 'Medium', value: '2048' },
        { name: 'Large', value: '4096' }
      )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const type = interaction.options.getString('type');
    const size = interaction.options.getString('size') || '1024';
    const member = interaction.guild?.members.cache.get(user.id) || await interaction.guild?.members.fetch(user.id);

    let avatarUrl: string;
    let isServerAvatar = false;

    if (type === 'server') {
      // Try to use the server avatar, fallback to user avatar if not set
      if (member?.avatar) {
        avatarUrl = member.displayAvatarURL({ size: Number(size) });
        isServerAvatar = true;
      } else {
        avatarUrl = user.displayAvatarURL({ size: Number(size) });
      }
    } else if (type === 'user') {
      avatarUrl = user.displayAvatarURL({ size: Number(size) });
    } else {
      // Default behavior: try server avatar, fallback to user avatar
      if (member?.avatar) {
        avatarUrl = member.displayAvatarURL({ size: Number(size) });
        isServerAvatar = true;
      } else {
        avatarUrl = user.displayAvatarURL({ size: Number(size) });
      }
    }

    const container = new ContainerBuilder();
    const mediaGallery = new MediaGalleryBuilder()
      .addItems(new MediaGalleryItemBuilder()
        .setURL(avatarUrl)
        .setDescription(`${user.username}'s ${isServerAvatar ? 'server avatar' : 'avatar'}`)
      );

    container.addMediaGalleryComponents(mediaGallery);

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  }
};
