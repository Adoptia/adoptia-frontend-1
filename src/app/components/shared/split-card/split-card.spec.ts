import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitCard } from './split-card';

describe('SplitCard', () => {
  let component: SplitCard;
  let fixture: ComponentFixture<SplitCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
