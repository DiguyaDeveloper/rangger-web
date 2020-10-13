import { StatusUser } from '../enums/status-user.enum';
import { UsuarioInfo } from '../models/UserInfo';
import { Usuario } from '../models/usuario';

export interface RegisterResponse {
  id: string;
  userStatus: StatusUser;
  registered?: boolean;
  user?: UsuarioInfo;
}

export interface AuthResponse {
  id: string;
  idToken: string;
  // refreshToken: string;
  expiresIn: string;
  // localId: string;
  userStatus: StatusUser;
  // registered?: boolean;
  user?: Usuario;
}
