import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Storage } from '@ionic/storage-angular';

// 1. Import the libs you need
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

import { environment } from 'src/environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { ServiceWorkerModule } from '@angular/service-worker';
@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideDatabase(() => getDatabase()),
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the app is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        }),
    ],
    providers: [
        Storage,
        {
            provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy
        }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
