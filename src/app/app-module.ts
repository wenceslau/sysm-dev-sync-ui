import {NgModule, provideBrowserGlobalErrorListeners} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing-module';
import {App} from './app';
import {Button, ButtonModule} from 'primeng/button';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {Menubar} from 'primeng/menubar';
import {PanelMenu} from 'primeng/panelmenu';
import {CommonModule} from '@angular/common';
import {StyleClassModule} from 'primeng/styleclass';
import {FormsModule} from '@angular/forms';
import {SelectButtonModule} from 'primeng/selectbutton';
import {DrawerModule} from 'primeng/drawer';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RippleModule} from 'primeng/ripple';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './services/security/auth-interceptor';

@NgModule({
  declarations: [
    App,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    Button,
    Menubar,
    PanelMenu,
    CommonModule,
    ButtonModule,
    StyleClassModule,
    FormsModule,
    SelectButtonModule,
    DrawerModule,
    ToggleSwitchModule,
    RadioButtonModule,
    RippleModule,
    ButtonModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {darkModeSelector: '.p-dark'},
      }
    })
  ],
  bootstrap: [App]
})
export class AppModule {
}
