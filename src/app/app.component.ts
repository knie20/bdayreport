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
  contacts: any[];
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
    this.contacts = [];
    this.pagination = {
      page: 1,
      pageSize: 1
    };
    this.dateLowerBound = this.today.clone();
    this.dateUpperBound = this.today.clone().add(7, 'days');

    this.ngbDateLowerBound = this.convertMomentToNgbDate(this.dateLowerBound);
    this.ngbDateUpperBound = this.convertMomentToNgbDate(this.dateUpperBound);

    this.badgeNumbers = {
      current: null,
      today: null,
      thisWeek: null,
      thisMonth: null
    };

    this.getCountforRange({start: this.dateLowerBound, end: this.dateUpperBound }, val => this.badgeNumbers.current = val.count);
    this.getCountforRange(this.getRangeForToday(), val => this.badgeNumbers.today = val.count);
    this.getCountforRange(this.getRangeForThisWeek(), val => this.badgeNumbers.thisWeek = val.count);
    this.getCountforRange(this.getRangeForThisMonth(), val => this.badgeNumbers.thisMonth = val.count);
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
    ).subscribe({
      next: value => {
        this.contacts = value.data;
        this.pagination = {
          totalResults: value.paging.totalResults,
          pageSize: value.paging.limit,
          page: value.paging.page,
          returned: value.paging.returned,
          totalPages: value.paging.totalPages,
        };
      },
      error: err => { console.log(err); }
    });
  }

  getCountforRange( range: { start: moment.Moment, end: moment.Moment}, onNext: (value: any) => void) {
    this.reportService.getReportCount(
      this.date.transform(range.start.toDate(), 'YYYY-MM-dd'),
      this.date.transform(range.end.toDate(), 'YYYY-MM-dd')
      )
      .subscribe({
        next: onNext,
        error: err => { console.log(err); }
      });
  }

  submitRange(): void {
    this.dateLowerBound = this.convertNgbDateToMoment(this.ngbDateLowerBound);
    this.dateUpperBound = this.convertNgbDateToMoment(this.ngbDateUpperBound);
    this.filterContacts(this.dateLowerBound, this.dateUpperBound, 1, 10);
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
    return NgbDate.from({ year: mo.year(), month: mo.month() + 1, day: mo.date() });
  }
}
