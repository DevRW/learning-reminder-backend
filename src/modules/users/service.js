import model from '../../database/models';
import gravatar from 'gravatar';
import generate from '../generates/generate';
import userHelper from './helper';
const { user } = model;
const { SECRET_OR_KEY } = process.env;

export class UserService {
  async register(data) {
    const create = await user.create({
      ...data,
      avatar: gravatar.url(data.email, { protocol: 'https' }),
      password: generate.encryptPassword(data.password),
    });
    const token = generate.generateToken({
      secret: SECRET_OR_KEY,
      payload: userHelper.userAuthPayload(create),
      time: '4h',
    });
    return {
      message: 'your account was created.',
      token,
      roles: create.roles,
    };
  }
  async findOne(query) {
    const find = await user.findOne(query);
    return find;
  }

  async updateInformation(data, userId) {
    const { username, avatar, password } = data;
    await user.update({ username, avatar }, { where: { id: userId } });
    return {
      message: 'updated successfully.',
    };
  }
  async changePassword(data, userId) {
    const { password } = data;
    await user.update({ password: generate.encryptPassword(password) }, { where: { id: userId } });
    return {
      message: 'updated successfully.',
    };
  }
}
export default new UserService();
