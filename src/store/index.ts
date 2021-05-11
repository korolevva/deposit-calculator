import { createContext } from 'react';
import { AppContainerStore } from './appContainerStore';

const appContainerStore = new AppContainerStore();

export const store = createContext({ appContainerStore });
