import { Injectable } from "@angular/core";
import { Buchung } from "../components/erp-table/erp-table.component";


@Injectable()
export class StateService {
    public buchungsliste: Buchung[] = []
    constructor() {
    }
}