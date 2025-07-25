import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFooter } from './form-footer';

describe('FormFooter', () => {
  let component: FormFooter;
  let fixture: ComponentFixture<FormFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
