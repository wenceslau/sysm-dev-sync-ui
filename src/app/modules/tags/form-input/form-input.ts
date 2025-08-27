import {Component, effect, inject, OnInit} from '@angular/core';
import {SignalApp} from '../../../services/signal-app';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateResponse, Tag, TagColor} from '../../../application/objects';
import {HttpApp, RequestData} from '../../../services/http-app';

@Component({
  selector: 'app-form-input',
  standalone: false,
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss'
})
export class FormInput implements OnInit {

  protected colors: TagColor[] = [];

  protected signalApp = inject(SignalApp);
  private httpApp = inject(HttpApp);

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
    this.colors = this.tagColors();
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
        let requestData = new RequestData("/tags/" + formValue.id, formValue);
        await this.httpApp.putAsync<void>(requestData);
      } else {
        let requestData = new RequestData("/tags", formValue);
        await this.httpApp.postAsync<CreateResponse>(requestData);
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

  tagColors(): TagColor[] {
    return [
      {name: "white", color: "#ffffff"},
      {name: "black", color: "#000000"},
      {name: "red", color: "#ff0000"},
      {name: "green", color: "#00ff00"},
      {name: "blue", color: "#0000ff"},
      {name: "yellow", color: "#ffff00"},
      {name: "purple", color: "#ff00ff"},
      {name: "orange", color: "#ffa500"},
      {name: "pink", color: "#ffc0cb"},
      {name: "brown", color: "#a52a2a"},
      {name: "gray", color: "#808080"},
      {name: "cyan", color: "#00ffff"},
      {name: "magenta", color: "#ff00ff"},
      {name: "lime", color: "#00ff00"},
      {name: "teal", color: "#008080"},
      {name: "olive", color: "#808000"},
      {name: "navy", color: "#000080"},
      {name: "nblue", color: "#2496ED"}
    ]
  }
}
