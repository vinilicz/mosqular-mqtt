import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionPanel } from './connection-panel';

describe('ConnectionPanel', () => {
  let component: ConnectionPanel;
  let fixture: ComponentFixture<ConnectionPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
