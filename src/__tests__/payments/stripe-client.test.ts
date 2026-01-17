/**
 * Stripe Client Tests
 *
 * Tests for the Stripe client initialization and configuration.
 * Note: Actual Stripe SDK initialization requires fetch, so we test
 * the configuration and error handling without instantiating the client.
 */

describe('Stripe Client Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getStripe Error Handling', () => {
    it('should throw error when STRIPE_SECRET_KEY is not configured', async () => {
      // Remove the secret key
      delete process.env.STRIPE_SECRET_KEY;

      // Import fresh to reset the singleton
      jest.resetModules();
      const { getStripe } = await import('@/lib/stripe');

      expect(() => getStripe()).toThrow('STRIPE_SECRET_KEY not configured');
    });
  });
});

describe('Subscription Tier Types', () => {
  it('should export SubscriptionTier type', async () => {
    const { SUBSCRIPTION_TIERS } = await import('@/lib/stripe');

    // Verify the structure includes both family and business types
    const types = new Set(Object.values(SUBSCRIPTION_TIERS).map((t) => t.type));
    expect(types.has('family')).toBe(true);
    expect(types.has('business')).toBe(true);
  });

  it('should have all expected tier keys', async () => {
    const { SUBSCRIPTION_TIERS } = await import('@/lib/stripe');

    // Family tiers
    expect(SUBSCRIPTION_TIERS.family_free).toBeDefined();
    expect(SUBSCRIPTION_TIERS.family_premium).toBeDefined();
    expect(SUBSCRIPTION_TIERS.family_pro).toBeDefined();

    // Business tiers
    expect(SUBSCRIPTION_TIERS.starter).toBeDefined();
    expect(SUBSCRIPTION_TIERS.professional).toBeDefined();
    expect(SUBSCRIPTION_TIERS.enterprise).toBeDefined();
  });
});
