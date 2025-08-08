import { 
  ContainerBuilder,
  MessageFlags,
  type ChatInputCommandInteraction
} from 'discord.js';

import { createCommandConfig, type CommandOptions, type CommandResult } from 'robo.js';

export const config = createCommandConfig(
	{
		description: 'Fetch the avatar of the specified user, defaults to self',
        options: [
            {
                name: 'user',
                type: 'user',
                description: 'The user to fetch the avatar of',
                required: false
            },
            {
                name: 'size',
                type: 'integer',
                description: 'The size of the avatar to fetch',
                choices: [
                    {
                        name: 'Small',
                        value: 1024
                    },
                    {
                        name: 'Medium',
                        value: 2048
                    },
                    {
                        name: 'Large',
                        value: 4096
                    }
                ],
                required: false
            }
        ]
	} as const
);

export default async (interaction: ChatInputCommandInteraction, options: CommandOptions<typeof config>): Promise<CommandResult> => {
    const user = options.user || interaction.user;
    const size = options.size || 1024;

    const container = new ContainerBuilder()
      .addMediaGalleryComponents((builder) => builder.addItems(
        (builder) => builder.setURL(user.displayAvatarURL({ size: size }))
      ))

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    })
}