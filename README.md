# ElMusicologo - Discord Music Bot

Bot de Discord llamado **ElMusicologo** para reproducir musica desde **YouTube**, **SoundCloud** y **Spotify** usando comandos slash.

## Requisitos

- Node.js 18+
- Un bot creado en el portal de Discord Developers
- `ffmpeg` instalado en tu sistema

## Configuracion

1. Instala dependencias:

```bash
npm install
```

2. Crea un archivo `.env` basado en `.env.example` y completa los valores:

```
DISCORD_TOKEN=tu_token
DISCORD_CLIENT_ID=tu_client_id
DISCORD_GUILD_ID=tu_guild_id
```

3. Inicia el bot:

```bash
npm start
```

## Instalacion facil (sin conocimientos tecnicos)

Si no sabes programar ni usar GitHub, puedes dejar el bot funcionando siguiendo estos pasos simples:

1. Descarga el proyecto como archivo ZIP:
   - En la pagina del repositorio, haz clic en **Code** → **Download ZIP**.
   - Descomprime el ZIP en una carpeta de tu computadora (por ejemplo, `ElMusicologo`).
2. Instala Node.js:
   - Ve a <https://nodejs.org/> y descarga la version LTS.
   - Instalala con los valores por defecto.
3. Instala FFmpeg:
   - **Windows:** descarga FFmpeg desde <https://ffmpeg.org/download.html> o usa un instalador como `winget install ffmpeg`.
   - **macOS:** `brew install ffmpeg`
   - **Linux:** `sudo apt install ffmpeg` (o el gestor de paquetes de tu distro).
4. Abre una terminal en la carpeta del proyecto:
   - **Windows:** abre la carpeta, haz clic derecho y selecciona *Abrir en Terminal*.
   - **macOS/Linux:** abre la carpeta y usa *Terminal*.
5. Instala las dependencias:

```bash
npm install
```

6. Crea el archivo `.env`:
   - Copia `.env.example` y renombralo a `.env`.
   - Abre `.env` y pega tus datos (`DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`).
7. Inicia el bot:

```bash
npm start
```

Cuando veas el mensaje **Bot listo como ...** el bot ya esta listo para usarse en tu servidor.

## Como agregar ElMusicologo a tu servidor

1. Entra a <https://discord.com/developers/applications> y crea una aplicacion.
2. En **Bot**, define el nombre del bot como **ElMusicologo** y copia el **Token**.
3. En **OAuth2 > URL Generator** marca los scopes **bot** y **applications.commands**.
4. En **Bot Permissions** selecciona:
   - View Channels
   - Connect
   - Speak
   - Use Voice Activity
   - Read Message History
5. Copia el link generado y abrelo en tu navegador para invitar el bot a tu servidor.
6. Coloca el `DISCORD_CLIENT_ID` (Application ID), `DISCORD_TOKEN` y `DISCORD_GUILD_ID` en tu `.env`.

## Comandos

ElMusicologo incluye comandos de reproduccion, gestion de cola y control de audio para que tengas una experiencia completa dentro del servidor. La interfaz se apoya en respuestas con embeds para mostrar lo que suena y la cola.

- `/play link` → Reproduce un link y lo agrega a la cola si ya hay musica.
- `/add link` → Inserta un link a la cola sin interrumpir.
- `/skip` → Pasa a la siguiente cancion.
- `/stop` → Detiene la reproduccion y limpia la cola.
- `/queue` → Muestra las proximas canciones.
- `/remove posicion` → Elimina una cancion de la cola por posicion.
- `/clear` → Limpia la cola de reproduccion.
- `/nowplaying` → Muestra lo que esta sonando.
- `/pause` → Pausa la reproduccion.
- `/resume` → Reanuda la reproduccion.
- `/volume nivel` → Ajusta el volumen (1-100).
- `/loop modo` → Repite la cancion actual o toda la cola (off/track/queue).
- `/shuffle` → Mezcla la cola actual.
- `/leave` → Saca el bot del canal de voz.
- `/autoleave` → Explica el auto-salida tras 2 minutos en soledad.

## Notas

- Los comandos se registran para un servidor especifico usando `DISCORD_GUILD_ID`.
- Puedes convertirlos en comandos globales cambiando `Routes.applicationGuildCommands` por `Routes.applicationCommands`.
- El bot se desconecta automaticamente si queda solo en un canal de voz por 2 minutos.
