import { Request } from 'express';
import { UsersDocument } from 'src/users/entities/user.entity';

interface RequestWithUser extends Request {
  user: UsersDocument;
}

export default RequestWithUser;
