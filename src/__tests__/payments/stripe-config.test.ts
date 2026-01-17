/**
 * Stripe Configuration Tests
 *
 * Tests for the Stripe configuration and subscription tiers.
 */

import { SUBSCRIPTION_TIERS, formatPrice, calculateAnnualSavings } from '@/lib/stripe';

describe('Subscription Tiers Configuration', () => {
  describe('Family Tiers', () => {
    it('should have a free family tier', () => {
      const tier = SUBSCRIPTION_TIERS.family_free;

      expect(tier.name).toBe('Family Free');
      expect(tier.type).toBe('family');
      expect(tier.monthlyPrice).toBe(0);
      expect(tier.annualPrice).toBe(0);
      expect(tier.stripePriceIdMonthly).toBeNull();
      expect(tier.stripePriceIdAnnual).toBeNull();
    });

    it('should have a premium family tier with correct pricing', () => {
      const tier = SUBSCRIPTION_TIERS.family_premium;

      expect(tier.name).toBe('Family Premium');
      expect(tier.type).toBe('family');
      expect(tier.monthlyPrice).toBe(1000); // $10.00 in cents
      expect(tier.annualPrice).toBe(10200); // $102.00/year
      // Annual should be discounted from monthly * 12
      expect(tier.annualPrice).toBeLessThan(tier.monthlyPrice * 12);
    });

    it('should have a pro family tier with correct pricing', () => {
      const tier = SUBSCRIPTION_TIERS.family_pro;

      expect(tier.name).toBe('Family Pro');
      expect(tier.type).toBe('family');
      expect(tier.monthlyPrice).toBe(1900); // $19.00
      expect(tier.annualPrice).toBe(19380); // $193.80/year
      expect(tier.limits?.freeTags).toBe(1);
    });
  });

  describe('Business Tiers', () => {
    it('should have a starter business tier', () => {
      const tier = SUBSCRIPTION_TIERS.starter;

      expect(tier.name).toBe('Business Starter');
      expect(tier.type).toBe('business');
      expect(tier.monthlyPrice).toBe(4900); // $49.00
    });

    it('should have a professional business tier', () => {
      const tier = SUBSCRIPTION_TIERS.professional;

      expect(tier.name).toBe('Business Pro');
      expect(tier.type).toBe('business');
      expect(tier.monthlyPrice).toBe(9900); // $99.00
      expect(tier.monthlyPrice).toBeGreaterThan(SUBSCRIPTION_TIERS.starter.monthlyPrice);
    });

    it('should have an enterprise business tier', () => {
      const tier = SUBSCRIPTION_TIERS.enterprise;

      expect(tier.name).toBe('Business Enterprise');
      expect(tier.type).toBe('business');
      expect(tier.monthlyPrice).toBe(24900); // $249.00
      expect(tier.monthlyPrice).toBeGreaterThan(SUBSCRIPTION_TIERS.professional.monthlyPrice);
    });
  });

  describe('Tier Features', () => {
    it('should have features array for all tiers', () => {
      Object.values(SUBSCRIPTION_TIERS).forEach((tier) => {
        expect(Array.isArray(tier.features)).toBe(true);
        expect(tier.features.length).toBeGreaterThan(0);
      });
    });

    it('should have higher tiers include more features', () => {
      // Family tiers
      const freeFeatures = SUBSCRIPTION_TIERS.family_free.features.length;
      const premiumFeatures = SUBSCRIPTION_TIERS.family_premium.features.length;
      const proFeatures = SUBSCRIPTION_TIERS.family_pro.features.length;

      expect(premiumFeatures).toBeGreaterThanOrEqual(freeFeatures);
      expect(proFeatures).toBeGreaterThanOrEqual(premiumFeatures);

      // Business tiers
      const starterFeatures = SUBSCRIPTION_TIERS.starter.features.length;
      const professionalFeatures = SUBSCRIPTION_TIERS.professional.features.length;
      const enterpriseFeatures = SUBSCRIPTION_TIERS.enterprise.features.length;

      expect(professionalFeatures).toBeGreaterThanOrEqual(starterFeatures);
      expect(enterpriseFeatures).toBeGreaterThanOrEqual(professionalFeatures);
    });
  });

  describe('Tier Limits', () => {
    it('should have limits defined for family tiers', () => {
      expect(SUBSCRIPTION_TIERS.family_free.limits?.dogs).toBeDefined();
      expect(SUBSCRIPTION_TIERS.family_premium.limits?.dogs).toBeDefined();
      expect(SUBSCRIPTION_TIERS.family_pro.limits?.dogs).toBeDefined();
    });

    it('should have increasing dog limits for higher family tiers', () => {
      const freeDogs = SUBSCRIPTION_TIERS.family_free.limits?.dogs || 0;
      const premiumDogs = SUBSCRIPTION_TIERS.family_premium.limits?.dogs || 0;
      const proDogs = SUBSCRIPTION_TIERS.family_pro.limits?.dogs || 0;

      expect(premiumDogs).toBeGreaterThan(freeDogs);
      expect(proDogs).toBeGreaterThan(premiumDogs);
    });

    it('should have limits defined for business tiers', () => {
      expect(SUBSCRIPTION_TIERS.starter.limits?.activeDogs).toBeDefined();
      expect(SUBSCRIPTION_TIERS.professional.limits?.activeDogs).toBeDefined();
      expect(SUBSCRIPTION_TIERS.enterprise.limits?.activeDogs).toBeDefined();
    });

    it('should have increasing active dog limits for higher business tiers', () => {
      const starterDogs = SUBSCRIPTION_TIERS.starter.limits?.activeDogs || 0;
      const professionalDogs = SUBSCRIPTION_TIERS.professional.limits?.activeDogs || 0;
      const enterpriseDogs = SUBSCRIPTION_TIERS.enterprise.limits?.activeDogs || 0;

      expect(professionalDogs).toBeGreaterThan(starterDogs);
      // Enterprise has -1 for unlimited, so check it's either -1 or greater than professional
      expect(enterpriseDogs === -1 || enterpriseDogs > professionalDogs).toBe(true);
    });

    it('should have enterprise tier with unlimited dogs (-1)', () => {
      expect(SUBSCRIPTION_TIERS.enterprise.limits?.activeDogs).toBe(-1);
      expect(SUBSCRIPTION_TIERS.enterprise.limits?.trainers).toBe(-1);
    });
  });

  describe('Annual Discount', () => {
    it('should offer annual discount for paid tiers', () => {
      const paidTiers = [
        SUBSCRIPTION_TIERS.family_premium,
        SUBSCRIPTION_TIERS.family_pro,
        SUBSCRIPTION_TIERS.starter,
        SUBSCRIPTION_TIERS.professional,
        SUBSCRIPTION_TIERS.enterprise,
      ];

      paidTiers.forEach((tier) => {
        const monthlyTotal = tier.monthlyPrice * 12;
        const annualPrice = tier.annualPrice;
        const discount = ((monthlyTotal - annualPrice) / monthlyTotal) * 100;

        // All tiers should offer some discount (13-17% range)
        // Enterprise offers "2 months free" which is ~16.67%
        expect(discount).toBeGreaterThanOrEqual(13);
        expect(discount).toBeLessThanOrEqual(18);
      });
    });
  });
});

describe('Helper Functions', () => {
  describe('formatPrice', () => {
    it('should format cents to dollars', () => {
      expect(formatPrice(0)).toBe('$0.00');
      expect(formatPrice(1000)).toBe('$10.00');
      expect(formatPrice(4900)).toBe('$49.00');
      expect(formatPrice(9999)).toBe('$99.99');
    });
  });

  describe('calculateAnnualSavings', () => {
    it('should calculate savings for premium tier', () => {
      const savings = calculateAnnualSavings('family_premium');
      // Monthly: $10 * 12 = $120, Annual: $102, Savings: $18
      expect(savings).toBe(1800); // In cents
    });

    it('should return 0 for free tier', () => {
      const savings = calculateAnnualSavings('family_free');
      expect(savings).toBe(0);
    });
  });
});
