import { PrismaClient } from '@prisma/client'
import { SapphireClient, container } from '@sapphire/framework'
import { ActivityType, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
import { type Guild } from './lib/interfaces/Guild'
import { type CooldownGuild } from './lib/interfaces/CooldownGuild'
import { type Session } from './lib/interfaces/Session'
config()

// Database init
const prisma = new PrismaClient()

declare module '@sapphire/pieces' {
  interface Container {
    db: PrismaClient
    rememberedUsers: Guild[]
    ignoredUsers: Guild[]
    usersInCooldown: CooldownGuild[]
    sessions: Session[]
  }
}

container.db = prisma
container.rememberedUsers = []
container.ignoredUsers = []
container.usersInCooldown = []
container.sessions = []

const token = process.env.BOT_TOKEN

const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  loadMessageCommandListeners: true,
  presence: {
    activities: [{
      name: 'custom',
      type: ActivityType.Custom,
      state: 'Controlling Access'
    }]
  }
})

client.login(token).catch((error) => { console.log(`The bot has crashed.\n ${error}`) })
