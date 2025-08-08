import { logger } from 'robo.js'
import db from '@/database/db.js'

export default async () => {
	logger.info(`Attached Prisma Instance ${db}`)
}