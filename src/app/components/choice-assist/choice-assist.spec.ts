import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceAssist } from './choice-assist';

describe('ChoiceAssist', () => {
  let component: ChoiceAssist;
  let fixture: ComponentFixture<ChoiceAssist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiceAssist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoiceAssist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
