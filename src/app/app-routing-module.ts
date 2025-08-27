import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Tags} from './modules/tags/tags';
import {Workspaces} from './modules/workspaces/workspaces';
import {Questions} from './modules/questions/questions';
import {Projects} from './modules/projects/projects';
import {Users} from './modules/users/users';
import {Home} from './application/home/home';

const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'question',
    component: Questions
  },
  {
    path: 'project',
    component: Projects
  },
  {
    path: 'workspace',
    component: Workspaces
  },
  {
    path: 'tag',
    component: Tags
  },
  {
    path: 'user',
    component: Users
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
