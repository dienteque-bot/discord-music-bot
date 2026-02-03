import 'dotenv/config';
import { Client, EmbedBuilder, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { Player } from 'discord-player';

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_GUILD_ID) {
  throw new Error('Faltan variables de entorno. Revisa el archivo .env.');
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const player = new Player(client);
const leaveTimers = new Map();

const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce un link de YouTube, SoundCloud o Spotify.')
    .addStringOption((option) =>
      option
        .setName('link')
        .setDescription('URL del audio o playlist')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('add')
    .setDescription('Agrega un link a la cola sin interrumpir.')
    .addStringOption((option) =>
      option
        .setName('link')
        .setDescription('URL del audio o playlist')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Pasa a la siguiente cancion.'),
  new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Detiene la reproduccion y limpia la cola.'),
  new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Cambia el volumen (1-100).')
    .addIntegerOption((option) =>
      option
        .setName('nivel')
        .setDescription('Volumen del 1 al 100')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Elimina una cancion de la cola por posicion.')
    .addIntegerOption((option) =>
      option
        .setName('posicion')
        .setDescription('Numero de la cancion en la cola')
        .setMinValue(1)
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Limpia la cola de reproduccion.'),
  new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Configura el modo de repeticion.')
    .addStringOption((option) =>
      option
        .setName('modo')
        .setDescription('off, track o queue')
        .addChoices(
          { name: 'off', value: 'off' },
          { name: 'track', value: 'track' },
          { name: 'queue', value: 'queue' }
        )
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Muestra la cola actual.'),
  new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Muestra la cancion en reproduccion.'),
  new SlashCommandBuilder()
    .setName('autoleave')
    .setDescription('Muestra el estado del auto-salida en 2 minutos.'),
  new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pausa la reproduccion.'),
  new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Reanuda la reproduccion.'),
  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Saca al bot del canal de voz.'),
  new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Mezcla la cola actual.'),
].map((command) => command.toJSON());

const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const buildTrackEmbed = (queue, title) => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(queue.currentTrack?.title ?? 'Desconocido')
    .addFields(
      { name: 'Duracion', value: queue.currentTrack?.duration ?? 'Desconocida', inline: true },
      { name: 'Solicitado por', value: queue.currentTrack?.requestedBy?.username ?? 'Desconocido', inline: true }
    );

  if (queue.currentTrack?.thumbnail) {
    embed.setThumbnail(queue.currentTrack.thumbnail);
  }

  return embed;
};

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
  await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), {
    body: commands,
  });
}

client.once('ready', async () => {
  try {
    await registerCommands();
    await client.user.setActivity('musica como ElMusicologo');
    console.log(`Bot listo como ${client.user.tag}`);
  } catch (error) {
    console.error('Error registrando comandos:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'play' || interaction.commandName === 'add') {
    const link = interaction.options.getString('link', true);
    const voiceChannel = interaction.member?.voice?.channel;

    if (!voiceChannel) {
      await interaction.reply('Necesitas estar en un canal de voz.');
      return;
    }

    if (!isValidUrl(link)) {
      await interaction.reply('Necesitas pasar un link valido despues del comando.');
      return;
    }

    await interaction.deferReply();

    try {
      const searchResult = await player.search(link, {
        requestedBy: interaction.user,
      });

      if (!searchResult.hasTracks()) {
        await interaction.editReply('No encontre resultados.');
        return;
      }

      const queue = player.nodes.create(interaction.guild, {
        metadata: {
          channel: interaction.channel,
        },
      });

      if (!queue.connection) {
        await queue.connect(voiceChannel);
      }

      if (searchResult.playlist) {
        queue.addTrack(searchResult.tracks);
      } else {
        queue.addTrack(searchResult.tracks[0]);
      }

      if (!queue.isPlaying()) {
        await queue.node.play();
      }

      const actionLabel = interaction.commandName === 'add' ? 'Agregado a la cola' : 'Reproduciendo';
      await interaction.editReply(
        searchResult.playlist
          ? `${actionLabel} playlist: **${searchResult.playlist.title}**`
          : `${actionLabel}: **${searchResult.tracks[0].title}**`
      );
    } catch (error) {
      console.error('Error reproduciendo:', error);
      await interaction.editReply('Ocurrio un error al reproducir.');
    }
  }

  if (interaction.commandName === 'skip') {
    const queue = player.nodes.get(interaction.guild);
    if (!queue || !queue.isPlaying()) {
      await interaction.reply('No hay musica sonando.');
      return;
    }

    queue.node.skip();
    await interaction.reply('Saltando a la siguiente cancion.');
  }

  if (interaction.commandName === 'stop') {
    const queue = player.nodes.get(interaction.guild);
    if (!queue) {
      await interaction.reply('No hay cola activa.');
      return;
    }

    queue.delete();
    await interaction.reply('Reproduccion detenida y cola limpiada.');
  }

  if (interaction.commandName === 'volume') {
    const queue = player.nodes.get(interaction.guild);
    if (!queue || !queue.isPlaying()) {
      await interaction.reply('No hay musica sonando.');
      return;
    }

    const level = interaction.options.getInteger('nivel', true);
    queue.node.setVolume(level);
    await interaction.reply(`Volumen ajustado a ${level}.`);
  }

  if (interaction.commandName === 'remove') {
    const queue = player.nodes.get(interaction.guild);
    if (!queue || !queue.isPlaying()) {
      await interaction.reply('No hay musica sonando.');
      return;
    }

    const position = interaction.options.getInteger('posicion', true);
    const track = queue.tracks.at(position - 1);
    if (!track) {
      await interaction.reply('No existe esa posicion en la cola.');
      return;
    }

    queue.removeTrack(track);
    await interaction.reply(`Eliminada: **${track.title}**`);
  }

  if (interaction.commandName === 'clear') {
    const queue = player.nodes.get(interaction.guild);
    if (!queue) {
      await interaction.reply('No hay cola activa.');
      return;
    }

    queue.tracks.clear();
    await interaction.reply('Cola limpiada.');
  }

  if (interaction.commandName === 'loop') {
    const queue = player.nodes.get(interaction.guild);
    if (!queue || !queue.isPlaying()) {
      await interaction.reply('No hay musica sonando.');
      return;
    }

    const mode = interaction.options.getString('modo', true);
    const loopMode = mode === 'track' ? 1 : mode === 'queue' ? 2 : 0;
    queue.setRepeatMode(loopMode);
    await interaction.reply(`Modo repeticion: **${mode}**`);
  }

  if (interaction.commandName === 'queue') {
    const queue = player.nodes.get(interaction.guild);
    if (!queue || !queue.isPlaying()) {
      await interaction.reply('La cola esta vacia.');
      return;
    }

    const upcoming = queue.tracks.toArray().slice(0, 10);
    const list = upcoming.length
      ? upcoming.map((track, index) => `${index + 1}. ${track.title}`).join('\n')
      : 'No hay mas canciones en la cola.';

    const embed = buildTrackEmbed(queue, 'Cola actual').addFields({
      name: 'Proximas canciones',
      value: list,
    });

    await interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'nowplaying') {
    const queue = player.nodes.get(interaction.guild);
    if (!queue || !queue.isPlaying()) {
      await interaction.reply('No hay musica sonando.');
      return;
    }

    const embed = buildTrackEmbed(queue, 'Ahora suena');
    await interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'autoleave') {
    await interaction.reply('El bot se va automaticamente si queda solo por 2 minutos.');
  }

  if (interaction.commandName === 'pause') {
    const queue = player.nodes.get(interaction.guild);
    if (!queue || !queue.isPlaying()) {
      await interaction.reply('No hay musica sonando.');
      return;
    }

    queue.node.setPaused(true);
    await interaction.reply('Reproduccion en pausa.');
  }

  if (interaction.commandName === 'resume') {
    const queue = player.nodes.get(interaction.guild);
    if (!queue || !queue.isPlaying()) {
      await interaction.reply('No hay musica sonando.');
      return;
    }

    queue.node.setPaused(false);
    await interaction.reply('Reproduccion reanudada.');
  }

  if (interaction.commandName === 'leave') {
    const queue = player.nodes.get(interaction.guild);
    if (queue) {
      queue.delete();
      await interaction.reply('Sali del canal de voz.');
    } else {
      await interaction.reply('No estoy en un canal de voz.');
    }
  }

  if (interaction.commandName === 'shuffle') {
    const queue = player.nodes.get(interaction.guild);
    if (!queue || !queue.isPlaying()) {
      await interaction.reply('No hay musica sonando.');
      return;
    }

    queue.tracks.shuffle();
    await interaction.reply('Cola mezclada.');
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
  const guild = newState.guild;
  const queue = player.nodes.get(guild);
  if (!queue || !queue.connection?.channel) {
    return;
  }

  const channel = queue.connection.channel;
  if (!channel) return;

  const nonBotMembers = channel.members.filter((member) => !member.user.bot);
  const existingTimer = leaveTimers.get(guild.id);

  if (nonBotMembers.size === 0) {
    if (!existingTimer) {
      const timer = setTimeout(() => {
        const currentQueue = player.nodes.get(guild);
        if (!currentQueue) return;

        const currentChannel = currentQueue.connection?.channel;
        if (!currentChannel) return;

        const stillEmpty = currentChannel.members.filter((member) => !member.user.bot).size === 0;
        if (stillEmpty) {
          currentQueue.delete();
        }
        leaveTimers.delete(guild.id);
      }, 2 * 60 * 1000);

      leaveTimers.set(guild.id, timer);
    }
  } else if (existingTimer) {
    clearTimeout(existingTimer);
    leaveTimers.delete(guild.id);
  }
});

client.login(DISCORD_TOKEN);
