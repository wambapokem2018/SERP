import {DialogflowService} from './../../services/dialogflow.service';
import {Message} from './../../models/message';
import {Component, OnInit, Input} from '@angular/core';
import {Subscription} from 'rxjs';
import {SpeechService} from 'ngx-speech';
import {StateService} from '@app/services/state.service';
import {Buchung} from '@app/components/erp-table/erp-table.component';

@Component({
  selector: 'message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {

  @Input('message')
  private message: Message;

  @Input('messages')
  private messages: Message[];

  private started = false;
  private msg = 'nothing';
  comment = '';
  context = '';
  subscription: Subscription;
  good: any;

  public buchungsliste: Buchung[] = []

  constructor(private dialogFlowService: DialogflowService, private speech: SpeechService) {
  }

  ngOnInit() {
    this.dialogFlowService.getObservable().subscribe((booking: Buchung) => {
      this.buchungsliste.push(booking);
    });
    this.speech.message.subscribe(msg => {
      this.msg = msg.message;
      this.sendMessage();
    });
    this.speech.context.subscribe(context => {
      this.context = context;
    });
    this.speech.started.subscribe(started => this.started = started);
  }


  toggleVoiceRecognition() {
    if (this.started) {
      this.speech.stop();
    } else {
      this.speech.start();
    }
  }


  public sendMessage(): void {
    this.message.timestamp = new Date();
    this.dialogFlowService.getResponse(this.msg).subscribe(res => {
      if (res.result.metadata.intentName === 'Buchung') {
        this.messages.push(new Message(res.result.resolvedQuery, 'assets/images/user.png'));
        this.messages.push(
          new Message(res.result.fulfillment.speech, 'assets/images/bot.png', res.timestamp)
        );

      } else if (res.result.metadata.intentName === 'copy') {
        this.messages.push(new Message(res.result.resolvedQuery, 'assets/images/user.png'));
        this.copy(new Date(res.result.parameters.day));
        this.messages.push(
          new Message(res.result.fulfillment.speech, 'assets/images/bot.png', res.timestamp)
        );
      }

    });
  }


  recordStart() {
    this.subscription = this.speech.message.subscribe(msg => {
      this.comment += msg.message + '\n';
    });
  }

  recordStop() {
    this.subscription.unsubscribe();
  }

  public copy(date:Date) {
    let dateObj = new Date(date);
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();

    let newdate = year + "/" + month + "/" + day;
    console.log(newdate);
    const liste: Buchung[] = [...this.buchungsliste];
    console.log(this.buchungsliste.length);
    console.log(liste.length);
    for (let i = 0; i < liste.length; i++) {
      console.log('out');
      if(liste[i].date === newdate) {
        console.log('in');
        const newBooking: Buchung =  Object.assign({}, liste[i]);
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();


        let nedate = year + "/" + month + "/" + day;
        newBooking.date = nedate;
        this.dialogFlowService.buchungSubject.next(newBooking);
      }
    }
  }
}
