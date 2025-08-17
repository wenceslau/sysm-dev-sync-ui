import {Injectable, Signal, signal} from '@angular/core';
import {Tag} from './clients/tag-client';
import {Workspace} from './clients/workspace-client';
import {Project} from './clients/project-client';

@Injectable({
  providedIn: 'root'
})
export class SignalsApp {

  public selectedTag = signal<Tag | null>(null);
  public selectedWorkspace = signal<Workspace | null>(null);
  public selectedProject = signal<Project | null>(null);

  public refreshTags = signal<boolean>(false);
  public refreshWorkspace = signal<boolean>(false);
  public refreshProjects = signal<boolean>(false);

  public showTagInput = signal<boolean>(false);
  public showWorkspaceInput = signal<boolean>(false);
  public showWorkspaceAddMember = signal<boolean>(false);

  public message = signal<any>(null);


}
