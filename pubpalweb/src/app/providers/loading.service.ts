import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  messages: { key: string, message: string }[];

  messagesUpdated: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    this.messages = [];
  }

  addMessage(key: string, message: string) {
    if (this.messages.findIndex(a => a.key === key) === -1) {
      this.messages.push({ key, message });
      this.messagesUpdated.emit();
    }
  }

  removeMessage(key: string) {
    const _msgIndex = this.messages.findIndex(a => a.key === key);
    this.messages.splice(_msgIndex, 1);
    this.messagesUpdated.emit();
  }
}
