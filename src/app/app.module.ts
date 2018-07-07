
import { MessageFormComponent } from './components/message-form/message-form.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageItemComponent } from './components/message-item/message-item.component';
import { DialogflowService } from './services/dialogflow.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { ErpTableComponent } from './components/erp-table/erp-table.component';
import { SpeechModule } from 'ngx-speech';
import { StateService } from './services/state.service';


@NgModule({
  declarations: [
    AppComponent,
    MessageListComponent,
    MessageFormComponent,
    MessageItemComponent,
    ErpTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SpeechModule,
  ],
  providers: [
    DialogflowService,
    { provide: 'SPEECH_LANG', useValue: 'de-DE' },
    StateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
