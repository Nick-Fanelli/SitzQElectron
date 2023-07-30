import { contextBridge } from 'electron';
import { boundElectronAPI } from './api/api';

contextBridge.exposeInMainWorld('electronAPI', boundElectronAPI);