import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ReportService } from './services/report.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    NgbPaginationModule
  ],
  providers: [
    DatePipe,
    ReportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
