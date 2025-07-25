import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedMessagePanel } from './selected-message-panel';

describe('SelectedMessagePanel', () => {
  let component: SelectedMessagePanel;
  let fixture: ComponentFixture<SelectedMessagePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedMessagePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedMessagePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
