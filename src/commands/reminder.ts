import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js';
import ms from 'ms';

export class ReminderCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'reminder',
      description: 'Get reminders!',
    });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ): void {
    registry.registerChatInputCommand((builder) => {
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option.setName('time').setDescription('Time').setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('reminder')
            .setDescription('The reminder')
            .setRequired(true)
        );
    });
  }

  public override async chatInputRun(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    await interaction.deferReply();

    const time = interaction.options.getString('time', true);
    const reminder = interaction.options.getString('reminder', true);

    const timeLeft = ms(time);
    if (!timeLeft)
      return void interaction.editReply(
        'Please provide a valid time. Example: 1h, 1m or 10s'
      );

    const embed = new EmbedBuilder()
      .setColor(Colors.Blurple)
      .setAuthor({
        name: `${interaction.user.displayName}'s reminder`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp()
      .addFields({
        name: 'Reminder',
        value: reminder,
      });

    interaction.editReply('The reminder has been scheduled!');

    setTimeout(() => {
      if (interaction.channel?.isSendable()) {
        interaction.channel.send({
          embeds: [embed],
          content: `<@${interaction.user.id}>`,
        });
      }
    }, timeLeft);
  }
}
