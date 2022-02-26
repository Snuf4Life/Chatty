import { ReactiveController, ReactiveControllerHost } from 'lit';

class SockIoManager {
  private static _instance: SockIoManager;

  public socket: any;

  constructor() {
    if (SockIoManager._instance) {
      return SockIoManager._instance;
    }
    SockIoManager._instance = this;
    try {
      //@ts-ignore
      this.socket = io('http://localhost:3000');
    } catch (error) {
      console.error('socket connection error!', error);
    }
  }
}

//Im just playing with this - I could put socket in app.ts and drill it down by props
//Not even sure if this is a legit way to implement a controller.

export class SocketController implements ReactiveController {
  host: ReactiveControllerHost;

  public socketInstance: any;

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
    const socketManager = new SockIoManager();
    this.socketInstance = socketManager.socket;
  }

  hostConnected() {}
  hostDisconnected() {}
}
