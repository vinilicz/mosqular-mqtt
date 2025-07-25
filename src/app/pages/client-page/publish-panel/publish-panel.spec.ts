import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishPanel } from './publish-panel';

describe('PublishPanel', () => {
  let component: PublishPanel;
  let fixture: ComponentFixture<PublishPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
