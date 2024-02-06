import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyMassIndexComponent } from './body-mass-index.component';

describe('BodyMassIndexComponent', () => {
  let component: BodyMassIndexComponent;
  let fixture: ComponentFixture<BodyMassIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyMassIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BodyMassIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
