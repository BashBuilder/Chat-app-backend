import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(env.USER_DB_URL, {
  dialect: 'postgres',
  logging:
    env.NODE_ENV === 'development' ? (msg: unknown) => logger.debug({ sequelize: msg }) : false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
});

export const connectToDatabase = async () => {
  await sequelize.authenticate();
  logger.info('User service connected to user db successfully');
};

export const closeDatabase = async () => {
  await sequelize.close();
  logger.info('User database connect closed');
};
