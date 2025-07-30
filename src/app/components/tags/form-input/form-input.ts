import {Component, effect, inject, OnInit} from '@angular/core';
import {SignalsApp} from '../../../services/signals-app';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Tag, TagClient, TagColor} from '../../../services/clients/tag-client';

@Component({
  selector: 'app-form-input',
  standalone: false,
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss'
})
export class FormInput implements OnInit {

  protected colors: TagColor[] = [];

  protected signalApp = inject(SignalsApp);
  private tagClient = inject(TagClient);

  protected visible: boolean = false;
  protected formGroup!: FormGroup;
  protected isSaving = false;
  protected header = 'New Tag';

  constructor() {
    effect(() => {
      const tagToEdit = this.signalApp.selectedTag();
      this.visible = this.signalApp.showTagInput();
      this.header = 'New Tag';
      this.initFormGroup();

      // Ensure the form and colors are ready before patching values
      if (this.visible && this.formGroup && this.colors.length > 0) {
        if (tagToEdit) {
          this.header = `Edit Tag: ${tagToEdit.name}`;
          this.formGroup.patchValue(tagToEdit);
        }
      }
    });
  }

  ngOnInit() {
    // 1. Initialize the color array first
    this.colors = this.tagClient.tagColors();
  }

  private initFormGroup() {
    // 2. Define the form group
    this.formGroup = new FormGroup({
      id: new FormControl<number | null>(null),
      name: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3)]),
      category: new FormControl<string | null>(null, [Validators.required]),
      description: new FormControl<string | null>(null, [Validators.required]),
      color: new FormControl<string | null>(null, [Validators.required]),
    });
  }

  async save() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    // 4. Get the raw form data, which includes the full TagColor object
    const formValue = this.formGroup.getRawValue() as Tag;

    try {
      if (formValue.id) {
        await this.tagClient.updateAsync(formValue.id.toString(), formValue);
      } else {
        await this.tagClient.saveAsync(formValue);
      }
      this.signalApp.refreshTags.set(true);
      this.closeDialog();
    } catch (error) {
      console.error("Failed to save tag", error);
    } finally {
      this.isSaving = false;
    }
  }

  closeDialog() {
    this.signalApp.showTagInput.set(false);
    this.signalApp.selectedTag.set(null);
    if (this.formGroup) {
      this.formGroup.reset();
    }
  }
}
