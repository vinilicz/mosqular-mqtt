import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutOutlet } from './layout-outlet';

describe('LayoutOutlet', () => {
  let component: LayoutOutlet;
  let fixture: ComponentFixture<LayoutOutlet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutOutlet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutOutlet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
