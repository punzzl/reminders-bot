import { SapphireClient } from '@sapphire/framework';
import { ClientOptions } from 'discord.js';

export class BotClient extends SapphireClient {
  constructor(options: ClientOptions) {
    super(options);
  }

  public start(): void {
    this.login(process.env.DISCORD_TOKEN);
  }
}
