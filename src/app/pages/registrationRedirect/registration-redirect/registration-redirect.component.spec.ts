import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationRedirectComponent } from './registration-redirect.component';

describe('RegistrationRedirectComponent', () => {
  let component: RegistrationRedirectComponent;
  let fixture: ComponentFixture<RegistrationRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationRedirectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrationRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
