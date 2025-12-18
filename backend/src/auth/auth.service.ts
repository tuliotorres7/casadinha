import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(profile: any): Promise<User> {
    const { id, emails, displayName, photos } = profile;
    const email = emails[0].value;

    let user = await this.usersService.findByGoogleId(id);

    if (!user) {
      user = await this.usersService.findByEmail(email);
      
      if (!user) {
        user = await this.usersService.create({
          email,
          name: displayName,
          googleId: id,
          picture: photos[0]?.value,
          coins: 1000, // Moedas iniciais
        });
      } else {
        // Atualiza o googleId se o usuário já existia por email
        user.googleId = id;
        await user.save();
      }
    }

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        coins: user.coins,
      },
    };
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.usersService.findById(userId);
  }
}
