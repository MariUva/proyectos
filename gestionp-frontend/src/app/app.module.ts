import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ServicesComponent } from './services/services.component';

import { ReactiveFormsModule } from '@angular/forms'; // ✅ Necesario para formularios reactivos
import { HttpClientModule } from '@angular/common/http';
import { LandingComponent } from './pages/landing/landing.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TasksComponent } from './pages/tasks/tasks.component'; // ✅ Necesario para consumir tu API REST

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ServicesComponent,
    LandingComponent,
    DashboardComponent,
    TasksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,  // ✅
    HttpClientModule      // ✅
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
