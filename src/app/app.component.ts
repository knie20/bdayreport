import { Component } from '@angular/core';
import { ReportService } from './services/report.service';

import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { NgbDate, NgbTab } from '@ng-bootstrap/ng-bootstrap';

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
    totalResults?: number,
    pageSize: number,
    page: number,
    returned?: number,
    totalPages?: number,
    sort?: string
  };
  today: moment.Moment;
  dateLowerBound: moment.Moment;
  dateUpperBound: moment.Moment;
  ngbDateLowerBound: NgbDate;
  ngbDateUpperBound: NgbDate;

  constructor(
    private reportService: ReportService,
    private date: DatePipe
    ) {
    this.today = moment();
    this.pagination = {
      page: 1,
      pageSize: 1
    };
    this.dateLowerBound = this.today.clone();
    this.dateUpperBound = this.today.clone().add(7, 'days');

    this.ngbDateLowerBound = this.convertMomentToNgbDate(this.dateLowerBound);
    this.ngbDateUpperBound = this.convertMomentToNgbDate(this.dateUpperBound);

    console.log(this.dateLowerBound);

    this.filterContacts(this.dateLowerBound, this.dateUpperBound, 1, 10);
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

  getCountforRange( range: { start: moment.Moment, end: moment.Moment} ) {
    this.reportService.getReportCount(this.date.transform(range.start.toDate()), this.date.transform(range.end.toDate()))
      .subscribe(obs => {

      });
  }

  submitRange(): void {
    this.dateLowerBound = this.convertNgbDateToMoment(this.ngbDateLowerBound);
    this.dateUpperBound = this.convertNgbDateToMoment(this.ngbDateUpperBound);
    this.filterContacts(this.dateLowerBound, this.dateUpperBound, 1, 10)
  }

  getRangeForToday(): {start: moment.Moment, end: moment.Moment} {
    return { start: this.today.startOf('day'), end: this.today.endOf('day') };
  }

  getRangeForThisWeek(): {start: moment.Moment, end: moment.Moment} {
    return { start: this.today.startOf('week'), end: this.today.endOf('week') };
  }

  getRangeForThisMonth(): {start: moment.Moment, end: moment.Moment} {
    return { start: this.today.startOf('month'), end: this.today.endOf('month') };
  }

  calculateAge(age: number): number {
    return moment().diff(age, 'years');
  }

  convertNgbDateToMoment(ngbDate: NgbDate): moment.Moment {
    return moment([ngbDate.year, ngbDate.month, ngbDate.day]);
  }

  convertMomentToNgbDate(mo: moment.Moment): NgbDate {
    return NgbDate.from({ year: mo.year(), month: mo.month() + 1, day: mo.day() });
  }
}
