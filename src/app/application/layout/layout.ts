import {Component, inject} from '@angular/core';
import {SignalApp} from '../../services/signal-app';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  protected signalsApp = inject(SignalApp);

}
