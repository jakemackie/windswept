import { createCommandConfig, type CommandResult } from 'robo.js'

export const config = createCommandConfig(
	{
		description: 'Responds with Pong!'
	}
)

export default (): CommandResult => 'Pong!';