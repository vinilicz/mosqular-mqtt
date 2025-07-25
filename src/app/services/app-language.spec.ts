import { TestBed } from '@angular/core/testing';

import { AppLanguage } from './app-language';

describe('AppLanguage', () => {
  let service: AppLanguage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppLanguage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
