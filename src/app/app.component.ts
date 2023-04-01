import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(private storage: Storage) {
    this.initializeApp()
  }

  async initializeApp() {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: true });
    }

    await this.storage.create();
  }
}
