import { Component } from '@angular/core';
import { ReportService } from './services/report.service';

import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { NgbDate, NgbTab } from '@ng-bootstrap/ng-bootstrap';

import { parse } from 'json2csv';
import { saveAs } from 'file-saver';


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
      pageSize: 10
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
    this.filterContacts(this.dateLowerBound, this.dateUpperBound, this.pagination.page, this.pagination.pageSize);
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

        this.ngbDateLowerBound = this.convertMomentToNgbDate(dateLowerBound);
        this.ngbDateUpperBound = this.convertMomentToNgbDate(dateUpperBound);
        this.dateLowerBound = dateLowerBound;
        this.dateUpperBound = dateUpperBound;

        this.badgeNumbers.current = value.paging.totalResults;
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
    this.filterContacts(this.dateLowerBound, this.dateUpperBound, this.pagination.page, this.pagination.pageSize);
  }

  setPageSize(pageSize: number): void {
    this.pagination.pageSize = pageSize;
    this.pagination.page = 1;
    this.filterContacts(this.dateLowerBound, this.dateUpperBound, this.pagination.page, this.pagination.pageSize);
  }

  getRangeForToday(): {start: moment.Moment, end: moment.Moment} {
    return { start: this.today.clone().startOf('day'), end: this.today.clone().endOf('day') };
  }

  getRangeForThisWeek(): {start: moment.Moment, end: moment.Moment} {
    return { start: this.today.clone().startOf('week'), end: this.today.clone().endOf('week') };
  }

  getRangeForThisMonth(): {start: moment.Moment, end: moment.Moment} {
    return { start: this.today.clone().startOf('month'), end: this.today.clone().endOf('month') };
  }

  calculateAge(age: number): number {
    return moment().diff(age, 'years');
  }

  convertNgbDateToMoment(ngbDate: NgbDate): moment.Moment {
    return moment([ngbDate.year, ngbDate.month - 1, ngbDate.day]);
  }

  convertMomentToNgbDate(mo: moment.Moment): NgbDate {
    return NgbDate.from({ year: mo.year(), month: mo.month() + 1, day: mo.date() });
  }

  export(): void {
    this.reportService.getReportData(
      this.date.transform(this.dateLowerBound.toDate(), 'YYYY-MM-dd'),
      this.date.transform(this.dateUpperBound.toDate(), 'YYYY-MM-dd'),
      {
        page: 1,
        pageSize: 10000,
        sort: ''
      }
    ).subscribe({
      next: value => {
        const blob = new Blob([ JSON.stringify(value.data) ], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, 'export.txt');
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
