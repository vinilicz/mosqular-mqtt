import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttObserversPanel } from './mqtt-observers-panel';

describe('MqttObserversPanel', () => {
  let component: MqttObserversPanel;
  let fixture: ComponentFixture<MqttObserversPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MqttObserversPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MqttObserversPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
