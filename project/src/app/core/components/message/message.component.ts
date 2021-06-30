import { Component, OnInit } from '@angular/core';
import { MessageData, MessageService, MessageType } from '@core/services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
    console.log(this.messageService.messages)
  }

  getHeader(message: MessageData) {
    switch(message.type) {
      case MessageType.ERROR : return "Error"; break;
      case MessageType.WARNING : return "Warning"; break;
      case MessageType.SUCCESS : return "Success"; break;
      case MessageType.INFO : return "Info"; break;
      case MessageType.DEBUG : return "Debug"; break;
      default: return "";
    }
  }

  getClass(message: MessageData) {
    switch(message.type) {
      case MessageType.ERROR : return "bg-danger text-light"; break;
      case MessageType.WARNING : return "bg-warning text-light"; break;
      case MessageType.SUCCESS : return "bg-success text-light"; break;
      default: return "";
    }
  }

}
