import {Component, inject, signal} from '@angular/core';
import {SignalApp} from './services/signal-app';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('sysm-dev-sync-ui');
  protected signalsApp = inject(SignalApp);
}
