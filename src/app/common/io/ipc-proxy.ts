/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { IpcProxyBase } from './ipc-proxy.base';
import { SchedulerBase } from '../scheduling/scheduler.base';

@Injectable()
export class IpcProxy implements IpcProxyBase {
    public constructor(private scheduler: SchedulerBase) {}

    public sendToMainProcess(channel: string, arg: unknown): void {
        ipcRenderer.send(channel, arg);
    }

    public async sendToMainProcessAsync(channel: string, arg: unknown): Promise<any> {
        ipcRenderer.send(`${channel}-request`, arg);

        let receivedMessage: any | undefined = undefined;

        ipcRenderer.on(`${channel}-response`, (_: Electron.IpcRendererEvent, message: any): void => {
            receivedMessage = message;
        });

        while (receivedMessage === undefined) {
            await this.scheduler.sleepAsync(100);
        }

        return receivedMessage;
    }
}
