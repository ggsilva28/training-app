import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

//Services
import { EventsService } from './events.service';

export type User = {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private storageKey: string = 'app-gym:user'

  constructor(
    private storage: StorageService,
    public events: EventsService,
  ) { }

  get(): Promise<User> {
    return this.storage.get(this.storageKey)
  }

  async set(user: User) {
    await this.storage.set(this.storageKey, user)
    this.events.publish('user:set')
  }
}
