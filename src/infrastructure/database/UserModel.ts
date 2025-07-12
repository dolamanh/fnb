import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class UserModel extends Model {
  static table = 'users';

  @field('name') name!: string;
  @field('email') email!: string;
  @field('phone') phone?: string;
  @field('avatar') avatar?: string;
  @field('is_active') isActive!: boolean;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
