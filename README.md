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

## Instalacion facil (paso a paso, sin experiencia)

Si no sabes programar ni usar GitHub, sigue exactamente estos pasos. Esta pensado para principiantes.

### Paso 1: Descargar el proyecto

1. En la pagina del repositorio, haz clic en **Code** → **Download ZIP**.
2. Descomprime el ZIP en una carpeta facil (por ejemplo, `Escritorio/ElMusicologo`).

### Paso 2: Instalar Node.js

1. Ve a <https://nodejs.org/> y descarga la version **LTS**.
2. Instalala con los valores por defecto.
3. Verifica que se instalo abriendo una terminal y escribiendo (sin copiar la palabra `bash`):

node -v

Deberias ver un numero de version (por ejemplo, `v20.x`).

### Paso 3: Instalar FFmpeg (obligatorio para que suene)

- **Windows (facil):** abre PowerShell y ejecuta:

winget install ffmpeg

- **macOS:** abre Terminal y ejecuta:

brew install ffmpeg

- **Linux (Ubuntu/Debian):**

sudo apt update  
sudo apt install ffmpeg

### Paso 4: Abrir la carpeta del bot en la terminal

1. Abre la carpeta donde descomprimiste el ZIP.
2. Haz clic derecho y selecciona **Abrir en Terminal** (Windows/macOS/Linux).
3. Asegurate de ver archivos como `package.json` y `src/`.
4. Si no ves esos archivos, significa que la terminal esta en otra carpeta. Escribe esto para entrar a la carpeta correcta:

- **Windows:**

cd "%USERPROFILE%\Escritorio\ElMusicologo"
dir

- **macOS/Linux:**

cd ~/Escritorio/ElMusicologo
ls

Si ves `package.json`, ya estas en la carpeta correcta.

### Paso 5: Instalar dependencias

En la terminal, ejecuta:

npm install

Espera a que termine (puede tardar varios minutos).

### Paso 6: Crear el archivo .env

1. Dentro de la carpeta del proyecto, busca `.env.example`.
2. Copialo y cambiale el nombre a `.env`.
3. Abre `.env` con un editor de texto (Bloc de notas, TextEdit, etc.).
4. Coloca tus datos asi:

```
DISCORD_TOKEN=tu_token
DISCORD_CLIENT_ID=tu_client_id
DISCORD_GUILD_ID=tu_guild_id
```

### Paso 7: Iniciar el bot

En la terminal, ejecuta:

npm start

Si todo esta bien, veras el mensaje **Bot listo como ...**. Deja esa ventana abierta mientras uses el bot.

### Si algo falla (soluciones rapidas)

- **"node no se reconoce"** → Node.js no se instalo bien. Reinstala desde <https://nodejs.org/>.
- **"ffmpeg no se reconoce"** → FFmpeg no esta instalado. Repite el Paso 3.
- **"Faltan variables de entorno"** → Revisa el archivo `.env` y completa los valores.
- **"La ejecucion de scripts esta deshabilitada" (Windows PowerShell)** → abre PowerShell como administrador y ejecuta:

Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

Luego cierra y vuelve a abrir PowerShell e intenta de nuevo.
- **"Cannot find dotenv"** → no se instalaron las dependencias. Ejecuta `npm install` dentro de la carpeta donde esta `package.json` y vuelve a ejecutar `npm start`.

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
