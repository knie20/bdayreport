import { Component } from '@angular/core';
import { ReportService } from './services/report.service';

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bdayreport';
  contacts = [];
  badgeNumbers: {
    current: number,
    today: number,
    thisWeek: number,
    thisMonth: number
  }
  today: number = moment.now();
  dateLowerBound: number;
  dateUpperBound: number;

  constructor(private reportService: ReportService) {
    this.contacts = reportService.getReportData().data;
    
  }

  filterContacts(): void {

  }

  calculateAge(age: number): number {
    return moment().diff(age, 'years');
  }
}
