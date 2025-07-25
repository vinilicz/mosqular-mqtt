import { TestBed } from '@angular/core/testing';

import { AppLayout } from './app-layout';

describe('AppLayout', () => {
  let service: AppLayout;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppLayout);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
