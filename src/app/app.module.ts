import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule, NgbPaginationModule, NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ReportService } from './services/report.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    HttpClientModule
  ],
  providers: [
    DatePipe,
    ReportService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
