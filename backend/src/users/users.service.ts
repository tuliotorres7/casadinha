import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userModel.findOne({ where: { googleId } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async create(userData: Partial<User>): Promise<User> {
    return this.userModel.create(userData);
  }

  async updateCoins(userId: number, coins: number): Promise<void> {
    await this.userModel.update({ coins }, { where: { id: userId } });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: ['id', 'email', 'name', 'picture', 'coins'],
      order: [['name', 'ASC']],
    });
  }
}
