import { TestBed } from '@angular/core/testing';

import { AppMqtt } from './app-mqtt';

describe('AppMqtt', () => {
  let service: AppMqtt;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppMqtt);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
