import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPage } from './client-page';

describe('ClientPage', () => {
  let component: ClientPage;
  let fixture: ComponentFixture<ClientPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
