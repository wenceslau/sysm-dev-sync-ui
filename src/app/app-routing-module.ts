import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Tags} from './modules/tags/tags';
import {Workspaces} from './modules/workspaces/workspaces';
import {Questions} from './modules/questions/questions';
import {Projects} from './modules/projects/projects';
import {Users} from './modules/users/users';
import {Home} from './application/home/home';
import {Login} from './application/login/login';
import {Layout} from './application/layout/layout';
import {AuthGuard} from './security/auth-guard';
import {Callback} from './security/callback/callback';

const routes: Routes = [
  {path: 'login', component: Login},
  {path: 'callback', component: Callback},
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: Home},
      {path: 'tags', component: Tags},
      {path: 'workspaces', component: Workspaces},
      {path: 'questions', component: Questions},
      {path: 'projects', component: Projects},
      {path: 'users', component: Users},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
