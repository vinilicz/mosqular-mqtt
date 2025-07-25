import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateHistoryModal } from './state-history-modal';

describe('StateHistoryModal', () => {
  let component: StateHistoryModal;
  let fixture: ComponentFixture<StateHistoryModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateHistoryModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateHistoryModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
