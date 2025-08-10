import {Component, effect, inject} from '@angular/core';
import {SignalsApp} from '../../../services/signals-app';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Workspace, WorkspaceClient} from '../../../services/clients/workspace-client';

@Component({
  selector: 'app-workspace-input',
  standalone: false,
  templateUrl: './workspace-input.html',
  styleUrl: './workspace-input.scss'
})

export class WorkspaceInput {
  protected signalApp = inject(SignalsApp);
  private workspaceClient = inject(WorkspaceClient);

  protected visible: boolean = false;
  protected formGroup!: FormGroup;
  protected isSaving = false;
  protected header = 'New Workspace';

  constructor() {
    effect(() => {
      const toEdit = this.signalApp.selectedWorkspace();
      this.visible = this.signalApp.showWorkspaceInput();
      this.header = 'New Workspace';
      this.initFormGroup();

      // Ensure the form and colors are ready before patching values
      if (this.visible && this.formGroup) {
        if (toEdit) {
          this.header = `Edit Workspace: ${toEdit.name}`;
          this.formGroup.patchValue(toEdit);
        }
      }
    });
  }


  private initFormGroup() {
    // 2. Define the form group
    this.formGroup = new FormGroup({
      id: new FormControl<number | null>(null),
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3)]),
      description: new FormControl<string | null>(null, [Validators.required]),
      isPrivate: new FormControl<boolean | null>(false),
    });
  }

  async save() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.formGroup.getRawValue() as Workspace;

    try {
      if (formValue.id) {
        await this.workspaceClient.updateAsync(formValue.id.toString(), formValue);
      } else {
        await this.workspaceClient.saveAsync(formValue);
      }
      this.signalApp.refreshWorkspace.set(true);
      this.closeDialog();
    } catch (error) {
      console.error("Failed to save workspace", error);
    } finally {
      this.isSaving = false;
    }
  }

  closeDialog() {
    this.signalApp.showWorkspaceInput.set(false);
    this.signalApp.selectedWorkspace.set(null);
    if (this.formGroup) {
      this.formGroup.reset();
    }
  }
}
