import {Component, inject, signal} from '@angular/core';
import {SignalsApp} from './services/signals-app';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('sysm-dev-sync-ui');
  protected signalsApp = inject(SignalsApp);
}
