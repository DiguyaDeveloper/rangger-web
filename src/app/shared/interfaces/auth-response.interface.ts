import { StatusUser } from '../enums/status-user.enum';
import { Usuario } from '../models/usuario';

export interface RegisterResponse {
  id: string;
  userStatus: StatusUser;
  registered?: boolean;
  user?: Usuario;
}

export interface AuthResponse {
  id: string;
  accessToken: string;
  // refreshToken: string;
  expiresIn: string;
  // localId: string;
  userStatus: StatusUser;
  // registered?: boolean;
  user?: Usuario;
}
