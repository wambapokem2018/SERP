import {environment} from './../../environments/environment';
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';
import {Buchung} from '../components/erp-table/erp-table.component';


@Injectable()
export class DialogflowService {

  private baseURL: string = 'https://api.dialogflow.com/v1/query?v=20150910';
  private token: string = environment.token;

  public sessionId: string = '1' + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9) + Math.floor(Math.random() * 9);
  public defaultBuchung: Buchung = {
    date: '',
    arbAuft: '',
    aktivitaet: '',
    text: '',
    arbeitsort: ``,
    hours: 0
  };
  public tmpBuchung: Buchung;
  public buchungSubject: Subject<Buchung> = new Subject<Buchung>();

  constructor(private http: Http) {
  }

  public getObservable(): Observable<Buchung> {
    return this.buchungSubject.asObservable();
  }

  public pushNewBooking(res: any) {
    if (res.result.metadata.intentName === 'Buchung' && res.result.actionIncomplete === false) {
      this.tmpBuchung = Object.assign({}, this.defaultBuchung);
      this.tmpBuchung.text = res.result.parameters.description;
      this.tmpBuchung.arbAuft = res.result.parameters.task;
      this.tmpBuchung.aktivitaet = res.result.parameters.activity;
      this.tmpBuchung.arbeitsort = res.result.parameters.location;
      let dateObj = new Date(res.result.parameters.day);
      let month = dateObj.getUTCMonth() + 1; //months from 1-12
      let day = dateObj.getUTCDate();
      let year = dateObj.getUTCFullYear();

      let newdate = year + '/' + month + '/' + day;
      this.tmpBuchung.date = newdate;
      this.tmpBuchung.hours = res.result.parameters.hours;
      this.buchungSubject.next(this.tmpBuchung);
    }
  }

  public getResponse(query: string) {
    let data = {
      query: query,
      lang: 'de',
      sessionId: this.sessionId
    };
    return this.http
      .post(`${this.baseURL}`, data, {headers: this.getHeaders()})
      .map(res => {
        if (res.json().result)
          this.pushNewBooking(res.json());
        return res.json();
      });
  }

  public getHeaders() {
    let headers = new Headers();
    headers.append('Authorization', `Bearer ${this.token}`);
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }
}
