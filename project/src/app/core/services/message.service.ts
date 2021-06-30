import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

export enum MessageType {
  ERROR, WARNING, SUCCESS, INFO, DEBUG
}

export interface MessageData {
  message: string;
  type: MessageType;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {


  messages: MessageData[] = [];
  constructor() {

  }

  error(message: string) {
    this.messages.push({message: message, type: MessageType.ERROR});   
  }

  warn(message: string) {
    this.messages.push({message: message, type: MessageType.WARNING});
    
  }

  success(message: string) {
    this.messages.push({message: message, type: MessageType.SUCCESS});    
  }

  info(message: string) {
    this.messages.push({message: message, type: MessageType.INFO});
  }

  debug(message: string) {
    this.messages.push({message: message, type: MessageType.DEBUG});
  }
  
  remove(message) {
    this.messages = this.messages.filter(t => t !== message);
  }
}
