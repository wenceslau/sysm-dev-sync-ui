import {Injectable, signal} from '@angular/core';
import {Project, Tag, Workspace} from '../application/objects';


@Injectable({
  providedIn: 'root'
})
export class SignalApp {

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
