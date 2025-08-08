import { ActivityType } from 'discord.js'
import { client } from 'robo.js'

export default () => {
	client.user?.setActivity({
		name: 'Change me',
		type: ActivityType.Custom,
	})
}