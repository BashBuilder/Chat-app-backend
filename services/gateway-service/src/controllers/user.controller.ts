import { userProxyService } from '@/services/user.proxy.service';
import { getAuthicatedUser } from '@/utils/auth';
import {
  createUserSchema,
  searchUsersSchema,
  UserIdParams,
  userIdParamsSchema,
} from '@/validation/user.schema';
import { AsyncHandler } from '@chatapp/common';

export const getUser: AsyncHandler = async (req, res, next) => {
  try {
    const { id } = userIdParamsSchema.parse(req.params);
    const user = await userProxyService.getUser(id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers: AsyncHandler = async (req, res, next) => {
  try {
    const users = await userProxyService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser: AsyncHandler = async (req, res, next) => {
  try {
    const payload = createUserSchema.parse(req.body);
    const user = await userProxyService.createUser(payload);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const searchUsers: AsyncHandler = async (req, res, next) => {
  try {
    const user = getAuthicatedUser(req);
    const { query, limit, excludeIds } = searchUsersSchema.parse(req.query);

    const sanitizedExcludeIds = Array.from(new Set([...(excludeIds || []), user.id]));
    const users = await userProxyService.searchUsers({
      query,
      limit,
      excludeIds: sanitizedExcludeIds,
    });
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};
