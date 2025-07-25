import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateObserverModal } from './update-observer-modal';

describe('UpdateObserverModal', () => {
  let component: UpdateObserverModal;
  let fixture: ComponentFixture<UpdateObserverModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateObserverModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateObserverModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
