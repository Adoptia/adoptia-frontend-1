import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickQuiz } from './quick-quiz';

describe('QuickQuiz', () => {
  let component: QuickQuiz;
  let fixture: ComponentFixture<QuickQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickQuiz);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
