import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private BASE_URL = 'https://api-sandbox.tomnx.com/';

  constructor(private httpClient: HttpClient) { }

  getReportData() {
    // return this.httpClient.get(this.BASE_URL);
    return {
      data: [
        {
          id: 1,
          userId: 1,
          userFullName: 'Name Name',
          fullName: 'Name of Contact',
          birthday: '1987-03-13',
          contact: {
            contactInfo: {
              contact: {
                phoneHome: '123412341',
                phoneMobile: '123412344',
                phoneWork: '123412342',
                email: 'test@test.co'
              }
            }
          }
        }
      ],
      paging: {
        totalResults: 30,
        limit: 10,
        page: 1,
        returned: 10,
        totalPages: 3
      },
      source: 1231321312
    };
  }
}
