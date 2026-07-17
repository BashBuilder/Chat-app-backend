import { User } from '@/__types__/user';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../sequelize';

export type UserCreationAttributes = Optional<User, 'id' | 'createdAt' | 'updatedAt'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  declare id: string;
  declare email: string;
  declare displayName: string;
  declare updatedAt: Date;
  declare createdAt: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    tableName: 'users',
  },
);
