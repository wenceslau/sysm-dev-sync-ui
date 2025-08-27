import {Component, effect, EventEmitter, inject, input, Input, Output} from '@angular/core';
import {SignalApp} from '../../../services/signal-app';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpApp, RequestData} from '../../../services/http-app';
import {CreateResponse, Project, Workspace} from '../../../application/objects';

@Component({
  selector: 'app-project-input',
  standalone: false,
  templateUrl: './project-input.html',
  styleUrl: './project-input.scss'
})
export class ProjectInput {

  private workspacePath: string = "/workspaces";
  private projectPath: string = "/projects";

  protected signalApp = inject(SignalApp);
  private httpApp = inject(HttpApp);

  protected formGroup!: FormGroup;
  protected isLoading = false;
  protected isSaving = false;
  protected isEdit = false
  protected header = 'New Project';
  private reloadProject = false;

  protected workspaces: Workspace[] = [];

  protected changeWorkspaceDialog = false;
  protected selectedWorkspace: Workspace | null = null;
  protected selectedProject: Project | null = null;

  constructor() {
    console.log("ProjectInput constructor");
    this.loadWorkspaces();
    effect(() => {
      this.selectedProject = this.signalApp.selectedProject();
      this.header = 'New Project';
      this.initFormGroup();

      // Ensure the form and colors are ready before patching values
      if (this.formGroup && this.selectedProject) {
        this.header = `Edit Project: ${this.selectedProject.name}`;
        this.loadProject(this.selectedProject.id);
      }
    });
  }

  reset() {
    this.isEdit = false;
    this.initFormGroup();
  }

  protected openChangeWorkspaceDialog() {
    if (!this.selectedProject) {
      return;
    }
    this.changeWorkspaceDialog = true;
    this.selectedWorkspace = this.selectedProject.workspace;
  }

  private initFormGroup() {
    this.formGroup = new FormGroup({
      id: new FormControl<string | null>(null),
      workspace: new FormControl<Workspace | null>(null),
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3)]),
      description: new FormControl<string | null>(null, [Validators.required]),
    });
  }

  private async loadWorkspaces() {
    let requestData = new RequestData(this.workspacePath + "/list");
    this.workspaces = await this.httpApp.getAsync<Workspace[]>(requestData);
  }

  private async loadProject(id: string, reloadProject: boolean = false) {
    if (reloadProject) {
      this.isLoading = true;
      let requestData = new RequestData(this.projectPath + "/" + id);
      this.selectedProject = await this.httpApp.getAsync<Project>(requestData);
      this.isLoading = false;
    }
    if (this.selectedProject) {
      this.formGroup.patchValue(this.selectedProject);
      this.isEdit = true;
    }
  }

  protected async changeWorkspace() {
    if (!this.selectedWorkspace) {
      return;
    }

    if (!this.selectedProject) {
      return;
    }

    this.isSaving = true;

    try {
      let fullPath = this.projectPath + "/" + this.selectedProject.id + "/workspace/" + this.selectedWorkspace.id;
      let requestData = new RequestData(fullPath);
      await this.httpApp.patchAsync<void>(requestData);

      const projectUpdated: Partial<Project> = {
        id: this.selectedProject.id,
        name: this.selectedProject.name,
        description: this.selectedProject.description,
        workspaceId: this.selectedWorkspace.id,
        workspace: this.selectedWorkspace,
      };

      this.formGroup.patchValue(projectUpdated);
      this.changeWorkspaceDialog = false;
      this.selectedWorkspace = null;

      this.signalApp.refreshProjects.set(true);

    } catch (error) {
      console.error("Failed to change workspace on the project");
    } finally {
      this.isSaving = false;
    }
  }

  protected async save() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const rawValue = this.formGroup.getRawValue();
    const projectPayload: Partial<Project> = {
      id: rawValue.id,
      name: rawValue.name,
      description: rawValue.description,
      workspaceId: rawValue.workspace.id
    };

    try {
      if (projectPayload.id) {
        let requestData = new RequestData(this.projectPath + "/" + projectPayload.id, projectPayload);
        await this.httpApp.putAsync<void>(requestData);
      } else {
        let requestData = new RequestData(this.projectPath, projectPayload);
        let response = await this.httpApp.postAsync<CreateResponse>(requestData);
        await this.loadProject(response.id, true);
      }
      this.signalApp.refreshProjects.set(true);

    } catch (error) {
      console.error("Failed to save projec", error);
    } finally {
      this.isSaving = false;
    }
  }


}
