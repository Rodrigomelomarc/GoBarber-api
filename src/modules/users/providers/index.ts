import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptiHashProvider from './HashProvider/implementations/BCryptHashProvider';

container.register<IHashProvider>('BCryptHashProvider', BCryptiHashProvider);
