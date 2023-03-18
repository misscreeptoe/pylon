import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DappListingCardComponent } from './dapp-listing-card.component';

describe('DappListingCardComponent', () => {
  let component: DappListingCardComponent;
  let fixture: ComponentFixture<DappListingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DappListingCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DappListingCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
