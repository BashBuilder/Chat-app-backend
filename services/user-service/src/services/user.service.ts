import { CreateUserInput, User } from '@/__types__/user';
import { userRepository, UserRepository } from '@/repository/user.repository';
import { AuthUserRegisteredPayload, ConflictError, NotFoundError } from '@chatapp/common';
import { UniqueConstraintError } from 'sequelize';

class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundError('User not found');

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.repository.findAll();
    return users;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    try {
      const user = await this.repository.create(input);
      //publish a new user created event todo
      return user;
    } catch (error) {
      if (error instanceof UniqueConstraintError) throw new ConflictError('User already exists');

      throw error;
    }
  }

  async searchUsers(params: {
    query: string;
    limit?: number;
    excludeIds?: string[];
  }): Promise<User[]> {
    const query = params.query.trim();
    if (!query.length) {
      return [];
    }

    return this.repository.searchByQuery(query, {
      limit: params.limit,
      excludeIds: params.excludeIds,
    });
  }

  async syncFromAuthUser(payload: AuthUserRegisteredPayload): Promise<User> {
    const user = await this.repository.upsertFromAuthEvent(payload);

    //publish a new user created event todo
    return user;
  }
}

export const userService = new UserService(userRepository);
