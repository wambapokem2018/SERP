import { DialogflowService } from './../../services/dialogflow.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {StateService} from '@app/services/state.service';


export interface Buchung {
  date: string;
  arbAuft: string;
  aktivitaet: string;
  text: string;
  arbeitsort: string;
  hours: number;
}
@Component({
  selector: 'app-erp-table',
  templateUrl: './erp-table.component.html',
  styleUrls: ['./erp-table.component.scss']
})
export class ErpTableComponent implements OnInit {

  public downloadJsonHref:SafeUrl;
  public buchungsliste: Buchung[] = []

  constructor(public dialogFlowService: DialogflowService,
    private sanitizer: DomSanitizer,
              private stateManager: StateService) { }

  ngOnInit() {
    this.dialogFlowService.getObservable().subscribe((booking: Buchung) => {
      this.buchungsliste.push(booking);
      this.generateDownloadJsonUri();
    });
    this.generateDownloadJsonUri();
  }

  generateDownloadJsonUri() {
    let theJSON = JSON.stringify(this.buchungsliste);
    let blob = new Blob([theJSON], { type: 'text/json' });
    let url= window.URL.createObjectURL(blob);
    let uri:SafeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    this.downloadJsonHref = uri;
}
  loadMock() {

    this.dialogFlowService.buchungSubject.next({
      date: '2018/7/8',
      arbAuft: 'BMW',
      aktivitaet: 'KV',
      text: 'Ticket-7684',
      arbeitsort: 'München',
      hours: 5
    })

    this.dialogFlowService.buchungSubject.next({
      date: '2018/7/8',
      arbAuft: 'Bookr',
      aktivitaet: 'KV',
      text: 'Ticket-0684',
      arbeitsort: 'München',
      hours: 7
    })
    this.dialogFlowService.buchungSubject.next({
      date: '2018/7/9',
      arbAuft: 'Gema',
      aktivitaet: 'NKV',
      text: 'Ticket-114',
      arbeitsort: 'München',
      hours: 3
    })

    this.dialogFlowService.buchungSubject.next({
      date: '2018/7/9',
      arbAuft: 'Bookr',
      aktivitaet: 'KV',
      text: 'Ticket-1684',
      arbeitsort: 'München',
      hours: 4
    })

    this.dialogFlowService.buchungSubject.next({
      date: '2018/7/9',
      arbAuft: 'BMW',
      aktivitaet: 'KV',
      text: 'Ticket-184',
      arbeitsort: 'München',
      hours: 2
    })
  }
}
