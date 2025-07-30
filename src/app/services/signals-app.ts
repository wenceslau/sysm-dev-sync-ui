import {Injectable, Signal, signal} from '@angular/core';
import {Tag } from './clients/tag-client';

@Injectable({
  providedIn: 'root'
})
export class SignalsApp {

  public selectedTag = signal<Tag | null>(null);

  public refreshTags = signal<boolean>(false);

  public showTagInput = signal<boolean>(false);
  setShowTagInput(value: boolean): void {
    this.showTagInput.set(value);
  }

}
