import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { SocketController } from './controllers/socket.js';

import { User } from './models/User.js';
import './components';

@customElement('app-index')
export class App extends LitElement {
  _socketController = new SocketController(this);

  @state()
  _user?: User;

  connectedCallback() {
    super.connectedCallback();

    const user = sessionStorage.getItem('user');
    if (user)
      this._socketController.socketInstance.emit(
        'reconnect-user',
        JSON.parse(user)
      );

    this._socketController.socketInstance.on('user-data', (user: User) => {
      this._user = user;
      sessionStorage.setItem('user', JSON.stringify(user));
    });
  }

  render() {
    return html`
      <page-layout>
        <main>
          ${this._user
            ? html`<chatty-title></chatty-title>`
            : html`<welcome-login></welcome-login>`}
        </main>
        ${this._user && html`<chat-app .currentUser=${this._user}></chat-app>`}
        <footer>
          <small>Developed by Michael Gilboa Gehtman</small>
        </footer>
      </page-layout>
    `;
  }

  createRenderRoot() {
    return this;
  }
}
