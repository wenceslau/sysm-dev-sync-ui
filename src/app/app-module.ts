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
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {StyleClassModule} from 'primeng/styleclass';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectButtonModule} from 'primeng/selectbutton';
import {DrawerModule} from 'primeng/drawer';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RippleModule} from 'primeng/ripple';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './services/security/auth-interceptor';
import {Header} from './components/layout/header/header';
import {definePreset} from '@primeuix/themes';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {OverlayBadge} from 'primeng/overlaybadge';
import {Avatar} from 'primeng/avatar';
import {Footer} from './components/layout/footer/footer';
import {Home} from './components/home/home';
import {Users} from './components/users/users';
import {Questions} from './components/questions/questions';
import {Projects} from './components/projects/projects';
import {Workspaces} from './components/workspaces/workspaces';
import {Tags} from './components/tags/tags';
import {DataViewModule} from 'primeng/dataview';
import {Divider} from 'primeng/divider';
import {Toolbar} from 'primeng/toolbar';
import {ProgressSpinner} from 'primeng/progressspinner';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {FormInput} from './components/tags/form-input/form-input';
import {Dialog} from 'primeng/dialog';
import {ColorPicker} from 'primeng/colorpicker';
import {Textarea} from 'primeng/textarea';
import {Select} from "primeng/select";
import {Tooltip} from "primeng/tooltip";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}'
    }
  }
});

@NgModule({
  declarations: [
    App,
    Header,
    Footer,
    Home,
    Users,
    Questions,
    Projects,
    Workspaces,
    Tags,
    FormInput,
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
    IconField,
    InputIcon,
    InputText,
    OverlayBadge,
    Avatar,
    NgOptimizedImage,
    DataViewModule,
    Divider,
    Toolbar,
    ProgressSpinner,
    ProgressSpinnerModule,
    Dialog,
    ReactiveFormsModule,
    ColorPicker,
    Textarea,
    Select,
    Tooltip
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {darkModeSelector: '.p-dark'},
      }
    })
  ],
  bootstrap: [App]
})
export class AppModule {
}
