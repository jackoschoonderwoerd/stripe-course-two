import { TestBed } from '@angular/core/testing';

import { StripeCheckoutService } from './stripe-checkout.service';

describe('CheckoutService', () => {
  let service: StripeCheckoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeCheckoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
