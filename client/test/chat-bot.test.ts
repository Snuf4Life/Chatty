import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import { ChatBot } from '../src/components/ChatBot.js';
import '../src/app.js';

describe('ChatBot', () => {
  let element: ChatBot;
  beforeEach(async () => {
    element = await fixture(html`<chat-bot></chat-bot>`);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
