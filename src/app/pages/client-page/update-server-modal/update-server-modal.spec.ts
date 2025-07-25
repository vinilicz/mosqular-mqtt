import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateServerModal } from './update-server-modal';

describe('UpdateServerModal', () => {
  let component: UpdateServerModal;
  let fixture: ComponentFixture<UpdateServerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateServerModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateServerModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
