import type { Command } from "@/types/Command";

export const logCommand = (command: Command): void => {
  try {
    if (typeof command.data.toJSON !== 'function') {
      console.log(`Loaded command: ${command.data.name}`);
      return;
    }

    const json = command.data.toJSON();
    const options = json.options ?? [];

    if (options.length === 0) {
      console.log(`Loaded command: ${json.name}`);
      return;
    }

    let hasSubcommands = false;
    for (const option of options) {
      if (option.type === 1) {
        console.log(`Loaded command: ${json.name} ${option.name}`);
        hasSubcommands = true;
      } else if (option.type === 2 && Array.isArray(option.options)) {
        for (const sub of option.options) {
          if (sub.type === 1) {
            console.log(`Loaded command: ${json.name} ${option.name} ${sub.name}`);
            hasSubcommands = true;
          }
        }
      }
    }

    if (!hasSubcommands) {
      console.log(`Loaded command: ${json.name}`);
    }
  } catch (error) {
    console.error(`Error logging command ${command?.data?.name || 'unknown'}:`, error);
    try {
      console.log(`Loaded command: ${command.data.name} (with errors)`);
    } catch {
      console.log(`Loaded command: [error getting name]`);
    }
  }
};
