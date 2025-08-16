import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInput } from './project-input';

describe('ProjectInput', () => {
  let component: ProjectInput;
  let fixture: ComponentFixture<ProjectInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
