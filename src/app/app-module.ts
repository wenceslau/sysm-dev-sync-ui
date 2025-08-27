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
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './security/auth-interceptor';
import {definePreset} from '@primeuix/themes';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {OverlayBadge} from 'primeng/overlaybadge';
import {Avatar} from 'primeng/avatar';
import {DataViewModule} from 'primeng/dataview';
import {Divider} from 'primeng/divider';
import {Toolbar} from 'primeng/toolbar';
import {ProgressSpinner} from 'primeng/progressspinner';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {Dialog} from 'primeng/dialog';
import {ColorPicker} from 'primeng/colorpicker';
import {Textarea} from 'primeng/textarea';
import {Select} from "primeng/select";
import {Tooltip} from "primeng/tooltip";
import {Scroller} from "primeng/scroller";
import {Message} from 'primeng/message';
import {TableModule} from 'primeng/table';
import {Checkbox} from "primeng/checkbox";
import {AutoComplete} from 'primeng/autocomplete';
import {Listbox} from "primeng/listbox";
import {Editor} from "primeng/editor";
import {Toast} from "primeng/toast";
import {MessageService} from 'primeng/api';
import {BlockUIModule} from 'primeng/blockui';
import {Skeleton} from 'primeng/skeleton';
import {Header} from './application/layout/header/header';
import {Footer} from './application/layout/footer/footer';
import {Home} from './application/home/home';
import {Users} from './modules/users/users';
import {Questions} from './modules/questions/questions';
import {Projects} from './modules/projects/projects';
import {Workspaces} from './modules/workspaces/workspaces';
import {Tags} from './modules/tags/tags';
import {FormInput} from './modules/tags/form-input/form-input';
import {WorkspaceInput} from './modules/workspaces/workspace-input/workspace-input';
import {WorkspaceAddMember} from './modules/workspaces/workspace-add-member/workspace-add-member';
import {ProjectInput} from './modules/projects/project-input/project-input';
import { Layout } from './application/layout/layout';
import { Login } from './application/login/login';
import { Callback } from './security/callback/callback';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fdfbf6',
      100: '#f6f2e2',
      200: '#e9dfb1',
      300: '#cebe8a',
      400: '#b29d64',
      500: '#957C3D',
      600: '#806a34',
      700: '#6b582b',
      800: '#564622',
      900: '#413519',
      950: '#2c2310'
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
    WorkspaceInput,
    WorkspaceAddMember,
    ProjectInput,
    Layout,
    Login,
    Callback,
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
    Tooltip,
    Scroller,
    Message,
    TableModule,
    Checkbox,
    AutoComplete,
    Listbox,
    Editor,
    Toast,
    BlockUIModule,
    Skeleton
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {darkModeSelector: '.p-dark'},
      }
    }),
    MessageService
  ],
  bootstrap: [App]
})
export class AppModule {
}
