import { Component } from '@angular/core';
import { ReportService } from './services/report.service';

import * as moment from 'moment';
import { DatePipe } from '@angular/common';

enum SortOptions {
  ContactFullNameDesc = '{fullName:desc}',
  ContactFullNameAsc = '{fullName:asc}'
  }


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
  };
  pagination: {
    totalResults: number,
    limit: number,
    page: number,
    returned: number,
    totalPages: number,
    sort: string
  };
  today: moment.Moment;
  dateLowerBound: moment.Moment;
  dateUpperBound: moment.Moment;

  constructor(
    private reportService: ReportService,
    private date: DatePipe
    ) {
    this.today = moment();
    this.pagination.page = 1;
    this.pagination.limit = 1;
    this.dateLowerBound = this.today;
    this.dateUpperBound = this.today.add(7, 'days');

    this.filterContacts(this.today, this.today.add(7, 'days'), 1, 1);
  }

  filterContacts(
    dateLowerBound: moment.Moment,
    dateUpperBound: moment.Moment,
    page: number,
    pageSize: number,
    sort?: string
    ): void {
    this.reportService.getReportData(
      this.date.transform(dateLowerBound.toDate(), 'YYYY-MM-dd'),
      this.date.transform(dateUpperBound.toDate(), 'YYYY-MM-dd'),
      {
        page,
        pageSize,
        sort: sort ? sort : ''
      }
    ).subscribe(obs => {
      console.log(obs);
    });
  }

  calculateAge(age: number): number {
    return moment().diff(age, 'years');
  }
}
