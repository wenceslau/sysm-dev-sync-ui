import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Home} from './components/home/home';
import {Users} from './components/users/users';
import {Questions} from './components/questions/questions';
import {Projects} from './components/projects/projects';
import {Workspaces} from './components/workspaces/workspaces';
import {Tags} from './components/tags/tags';

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
