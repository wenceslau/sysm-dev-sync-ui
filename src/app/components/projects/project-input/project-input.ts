import {Component, effect, inject} from '@angular/core';
import {SignalsApp} from '../../../services/signals-app';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Project, ProjectClient} from '../../../services/clients/project-client';
import {Workspace, WorkspaceClient} from '../../../services/clients/workspace-client';
import {User} from '../../../services/clients/user-client';

@Component({
  selector: 'app-project-input',
  standalone: false,
  templateUrl: './project-input.html',
  styleUrl: './project-input.scss'
})
export class ProjectInput {
  protected signalApp = inject(SignalsApp);
  private projectClient = inject(ProjectClient);
  private workspaceClient = inject(WorkspaceClient);

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

  protected reset() {
    this.isEdit = false;
    this.signalApp.selectedProject.set(null);
    if (this.formGroup) {
      this.formGroup.reset();
    }
  }

  protected openChangeWorkspaceDialog() {
    if (!this.selectedProject) {
      return;
    }
    this.changeWorkspaceDialog = true;
    this.selectedWorkspace = this.selectedProject.workspace;
  }

  private initFormGroup() {
    // 2. Define the form group
    this.formGroup = new FormGroup({
      id: new FormControl<string | null>(null),
      workspace: new FormControl<Workspace | null>(null),
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3)]),
      description: new FormControl<string | null>(null, [Validators.required]),
    });
  }

  private async loadWorkspaces() {
    this.workspaces = await this.workspaceClient.listAsync({}, "/list");
  }

  private async loadProject(id: string) {
    if (this.reloadProject){
      this.isLoading = true;
      this.selectedProject = await this.projectClient.getByIdAsync(id);
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
      await this.projectClient.updatePatchAsync(this.selectedProject.id, {}, "/workspace/" + this.selectedWorkspace.id);

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
        await this.projectClient.updateAsync(projectPayload.id, projectPayload as Project);
      } else {
        await this.projectClient.saveAsync(projectPayload as Project);
      }
      this.signalApp.refreshProjects.set(true);

      // this.reset();
    } catch (error) {
      console.error("Failed to save projec", error);
    } finally {
      this.isSaving = false;
    }
  }

}
