import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tags } from './tags';

describe('Tags', () => {
  let component: Tags;
  let fixture: ComponentFixture<Tags>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tags]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tags);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
