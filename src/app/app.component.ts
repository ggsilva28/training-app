import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(private storage: Storage) {
  }

  async ngOnInit() {
    await this.storage.create();
  }
}