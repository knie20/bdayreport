import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
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
        headers: { Authorization: 'Bearer ' + this.TOKEN }
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
    // return {
    //   data: [
    //     {
    //       id: 1,
    //       userId: 1,
    //       userFullName: 'Name Name',
    //       fullName: 'Name of Contact',
    //       birthday: '1987-03-13',
    //       contact: {
    //         contactInfo: {
    //           contact: {
    //             phoneHome: '123412341',
    //             phoneMobile: '123412344',
    //             phoneWork: '123412342',
    //             email: 'test@test.co'
    //           }
    //         }
    //       }
    //     }
    //   ],
    //   paging: {
    //     totalResults: 30,
    //     limit: 10,
    //     page: 1,
    //     returned: 10,
    //     totalPages: 3
    //   },
    //   source: 1231321312
    // };
  }
}
