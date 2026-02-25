import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookbookComponent } from './lookbook';

describe('Lookbook', () => {
  let component: LookbookComponent;
  let fixture: ComponentFixture<LookbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookbookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookbookComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
