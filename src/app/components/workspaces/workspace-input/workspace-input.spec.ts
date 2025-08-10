import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceInput } from './workspace-input';

describe('WorkspaceInput', () => {
  let component: WorkspaceInput;
  let fixture: ComponentFixture<WorkspaceInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkspaceInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
