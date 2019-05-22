import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// add form
import { FormsModule } from '@angular/forms';
// add clipboard
import { ClipboardModule } from 'ngx-clipboard';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './history/history.component';
import { StorageService } from './services/storage.service';

@NgModule({
    declarations: [AppComponent, HomeComponent, HistoryComponent],
    imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, FormsModule, ClipboardModule],
    providers: [StorageService],
    bootstrap: [AppComponent]
})
export class AppModule {}
