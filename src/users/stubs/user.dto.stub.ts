import { UserDTO } from '../dtos/user.dto';

export const UserDTOStub = (): UserDTO => {
  return {
    name: 'Guille',
    message: 'Este es un mensaje',
  };
};
