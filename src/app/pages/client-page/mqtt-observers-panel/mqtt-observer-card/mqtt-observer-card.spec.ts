import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttObserverCard } from './mqtt-observer-card';

describe('MqttObserverCard', () => {
  let component: MqttObserverCard;
  let fixture: ComponentFixture<MqttObserverCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MqttObserverCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MqttObserverCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
