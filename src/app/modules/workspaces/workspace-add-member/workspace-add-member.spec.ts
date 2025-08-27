import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceAddMember } from './workspace-add-member';

describe('WorkspaceAddMember', () => {
  let component: WorkspaceAddMember;
  let fixture: ComponentFixture<WorkspaceAddMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkspaceAddMember]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceAddMember);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
