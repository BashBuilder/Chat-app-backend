import { userService } from '@/services/user.service';
import { CreateUserBody, SearchUsersQueryParams, UserIdParams } from '@/validation/user.schema';
import { AsyncHandler } from '@chatapp/common';

export const getUser: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = req.params as unknown as UserIdParams;
    const user = await userService.getUserById(id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers: AsyncHandler = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser: AsyncHandler = async (req, res, next) => {
  try {
    const payload = req.body as CreateUserBody;
    const user = await userService.createUser(payload);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const searchUsers: AsyncHandler = async (req, res, next) => {
  try {
    const { query, limit, excludeIds } = req.validated?.query as unknown as SearchUsersQueryParams;
    const users = await userService.searchUsers({ query, limit, excludeIds });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
