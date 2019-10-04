import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private BASE_URL = 'https://api-sandbox.tomnx.com/';
  private TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsInVzZXJuYW1lIjoibW9ydGdhZ2UiLCJvcmdJZCI6NSwicm9sZUlkIjo4LCJncmFudF90eXBlIjoiYWNjZXNzX3Rva2VuIiwiaWF0IjoxNTcwMTE2NzMyLCJleHAiOjE1NzAyMDMxMzJ9.gnIyQKbwMmWcDGdfXjN3_3Hx8X4AkR7apvwoJBkm3DU';
  private REPORT_URL = 'api/corereports/birthday';

  constructor(private httpClient: HttpClient) { }

  getReportCount(
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.httpClient.post(
      this.BASE_URL + this.REPORT_URL,
      {},
      {
        headers: { Authorization: 'Bearer ' + this.TOKEN },
        params: {
          startDate,
          endDate,
          isCountOnly: 'true'
        }
      }
    );
  }

  getReportData(
    startDate: string,
    endDate: string,
    pagination: {
      page: number,
      pageSize: number,
      sort: string
    }): Observable<any> {
    return this.httpClient.post(
      this.BASE_URL + this.REPORT_URL,
      {},
      {
        headers: { Authorization: 'Bearer ' + this.TOKEN },
        params: {
          startDate,
          endDate,
          page: pagination.page ? pagination.page.toString() : '1',
          pageSize: pagination.pageSize ? pagination.pageSize.toString() : '10',
          sort: pagination.sort ? pagination.sort : ''
        }
      }
      );
  }
}
