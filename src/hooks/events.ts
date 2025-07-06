import { Client } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface EventModule {
  default: {
    name: string;
    once?: boolean;
    execute: (...args: unknown[]) => void;
  };
}

interface EventDefinition {
  name: string;
  once?: boolean;
  execute: (...args: unknown[]) => void;
}

/**
 * Filters directory contents to find valid TypeScript/JavaScript event files
 */
function filterEventFiles(files: string[]): string[] {
  return files.filter(file => file.endsWith('.ts') || file.endsWith('.js'));
}

/**
 * Validates that an event has all required properties
 */
function isValidEvent(event: unknown, filename: string): event is EventDefinition {
  if (!event || typeof event !== 'object' || !('name' in event) || !('execute' in event)) {
    console.warn(`⚠️  Event file ${filename} is missing required properties (name/execute)`);
    return false;
  }
  return true;
}

/**
 * Imports and validates an event module from a file path
 */
async function loadEventModule(filePath: string, filename: string): Promise<EventDefinition | null> {
  try {
    const eventModule: EventModule = await import(filePath);
    const event = eventModule.default;

    return isValidEvent(event, filename) ? event : null;
  } catch (error) {
    console.warn(`⚠️  Failed to load event from ${filename}:`, error);
    return null;
  }
}

/**
 * Registers an event with the Discord client
 */
function registerEvent(client: Client, event: EventDefinition): void {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

/**
 * Loads all event files from the events directory and registers them with the client
 */
export async function loadEvents(client: Client): Promise<void> {
  try {
    const eventsPath = join(__dirname, '..', 'events');
    const allFiles = await readdir(eventsPath);
    const eventFiles = filterEventFiles(allFiles);

    for (const filename of eventFiles) {
      const filePath = join(eventsPath, filename);
      const event = await loadEventModule(filePath, filename);

      if (event) {
        registerEvent(client, event);
      }
    }
  } catch (error) {
    console.error('Failed to load events:', error);
    throw error;
  }
}
