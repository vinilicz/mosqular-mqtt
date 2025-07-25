import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServersListModal } from './servers-list-modal';

describe('ServersListModal', () => {
  let component: ServersListModal;
  let fixture: ComponentFixture<ServersListModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServersListModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServersListModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
