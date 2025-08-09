import { type CommandResult, createCommandConfig } from "robo.js";

export const config = createCommandConfig({
	description: "Responds with Pong!",
});

export default (): CommandResult => "Pong!";
