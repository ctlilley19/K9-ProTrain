'use client';

import Link from 'next/link';
import { Dog, ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  const lastUpdated = 'January 16, 2025';
  const effectiveDate = 'January 16, 2025';

  return (
    <div className="min-h-screen bg-surface-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow-amber">
                <Dog size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">K9 ProTrain</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-surface-400 hover:text-white transition-colors">
              <ArrowLeft size={16} />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <div className="flex flex-wrap gap-4 text-sm text-surface-400">
              <span>Last Updated: {lastUpdated}</span>
              <span>|</span>
              <span>Effective Date: {effectiveDate}</span>
            </div>
          </div>

          <div className="prose prose-invert prose-surface max-w-none space-y-8">
            {/* Section 1: Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction and Acceptance of Terms</h2>
              <div className="text-surface-300 space-y-4">
                <p>
                  Welcome to K9 ProTrain. These Terms of Service ("Terms," "Agreement") constitute a legally binding agreement between you ("User," "you," "your") and Lazy E Holdings LLC, a Texas limited liability company with its principal place of business in Texas, United States ("Company," "we," "us," "our"), governing your access to and use of the K9 ProTrain platform, including our website at k9protrain.com, mobile applications for iOS and Android, application programming interfaces (APIs), and all related services, features, content, and functionality (collectively, the "Service").
                </p>
                <p>
                  By accessing or using the Service, creating an account, clicking "I Agree," "Sign Up," "Accept," or similar buttons, or by otherwise manifesting your assent to these Terms, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <Link href="/privacy" className="text-brand-400 hover:text-brand-300 underline">Privacy Policy</Link>, which is incorporated herein by reference. If you do not agree to these Terms, you must not access or use the Service.
                </p>
                <p>
                  If you are entering into these Terms on behalf of a company, organization, or other legal entity, you represent and warrant that you have the authority to bind such entity to these Terms. In such case, "you" and "your" shall refer to such entity.
                </p>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mt-4">
                  <p className="font-semibold text-red-400 mb-2">IMPORTANT LEGAL NOTICES:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li><strong>ARBITRATION:</strong> These Terms contain a binding arbitration clause and class action waiver in Section 22 that affects your legal rights. Please read it carefully.</li>
                    <li><strong>LIMITATION OF LIABILITY:</strong> Our liability is limited as described in Section 17. Please review these limitations.</li>
                    <li><strong>AUTOMATIC RENEWAL:</strong> Subscriptions automatically renew unless cancelled. See Section 6 for details.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2: Definitions */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Definitions</h2>
              <div className="text-surface-300 space-y-4">
                <p>The following definitions apply throughout these Terms:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">"Account"</strong> means the unique user account created to access and use the Service, including all associated credentials, settings, and preferences.</li>
                  <li><strong className="text-white">"Affiliate"</strong> means any entity that directly or indirectly controls, is controlled by, or is under common control with a party, where "control" means ownership of more than 50% of the voting securities.</li>
                  <li><strong className="text-white">"API"</strong> means the application programming interfaces, software development kits, and related documentation provided by us to enable programmatic access to the Service.</li>
                  <li><strong className="text-white">"Authorized User"</strong> means any individual authorized by you to access and use the Service under your Account, including employees, contractors, and agents.</li>
                  <li><strong className="text-white">"Badge"</strong> means a digital credential, achievement marker, or certification issued through the Service to recognize training milestones or accomplishments.</li>
                  <li><strong className="text-white">"Confidential Information"</strong> means any non-public information disclosed by one party to the other that is designated as confidential or should reasonably be understood to be confidential.</li>
                  <li><strong className="text-white">"Content"</strong> means any text, images, photographs, videos, audio recordings, graphics, data, files, documents, or other materials uploaded, posted, transmitted, or otherwise made available through the Service.</li>
                  <li><strong className="text-white">"Dog Profile"</strong> means the comprehensive digital record associated with a specific dog, including identifying information, photographs, medical records, training history, behavioral assessments, and progress tracking data.</li>
                  <li><strong className="text-white">"Facility"</strong> means a dog training business, kennel, boarding facility, daycare center, veterinary clinic, grooming establishment, or other organization using the Service to manage operations and client relationships.</li>
                  <li><strong className="text-white">"Intellectual Property Rights"</strong> means all patents, copyrights, trademarks, trade secrets, and other proprietary rights recognized under applicable law.</li>
                  <li><strong className="text-white">"Malicious Code"</strong> means any code, file, or program designed to damage, interfere with, or gain unauthorized access to any system, including viruses, worms, Trojan horses, ransomware, spyware, and similar threats.</li>
                  <li><strong className="text-white">"Pet Parent"</strong> means an individual user who owns, is responsible for, or has legal custody of a dog receiving services from a Trainer or Facility using the platform.</li>
                  <li><strong className="text-white">"Personal Data"</strong> has the meaning given in our Privacy Policy and includes any information relating to an identified or identifiable natural person.</li>
                  <li><strong className="text-white">"Service Level"</strong> means the performance standards and availability targets for the Service as described in Section 10.</li>
                  <li><strong className="text-white">"Staff Member"</strong> means an employee, contractor, or agent of a Facility who is granted access to the Service under the Facility's Account.</li>
                  <li><strong className="text-white">"Subscription"</strong> means the paid access plan selected by users, which determines the features, limitations, and pricing applicable to their use of the Service.</li>
                  <li><strong className="text-white">"Subscription Term"</strong> means the period during which your Subscription is active, either monthly or annually as selected.</li>
                  <li><strong className="text-white">"Trainer"</strong> means an individual or entity providing professional dog training, behavior modification, obedience instruction, or related services through the platform.</li>
                  <li><strong className="text-white">"Training Record"</strong> means the documented history of training activities, sessions, progress notes, and assessments associated with a Dog Profile.</li>
                  <li><strong className="text-white">"User Data"</strong> means all data, Content, and information that you or your Authorized Users submit to, store within, or generate through the Service.</li>
                  <li><strong className="text-white">"User-Generated Content" or "UGC"</strong> means any Content created, uploaded, or shared by users of the Service, including but not limited to photos, videos, reviews, comments, and training notes.</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Eligibility */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Eligibility and Account Registration</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">3.1 Eligibility Requirements</h3>
                <p>To be eligible to use the Service, you must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be at least eighteen (18) years of age, or the age of legal majority in your jurisdiction if higher;</li>
                  <li>Have the legal capacity and authority to enter into a binding contract;</li>
                  <li>Not be barred from using the Service under the laws of the United States or any other applicable jurisdiction;</li>
                  <li>Not have been previously suspended, removed, or banned from the Service;</li>
                  <li>If registering on behalf of an entity, have full legal authority to bind that entity to these Terms;</li>
                  <li>Comply with all applicable local, state, national, and international laws and regulations.</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">3.2 Account Registration Process</h3>
                <p>When creating an Account, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, complete, and truthful information as prompted by the registration form;</li>
                  <li>Maintain and promptly update your Account information to keep it accurate, current, and complete;</li>
                  <li>Create only one Account per person (unless explicitly authorized for Staff Accounts);</li>
                  <li>Use a valid email address that you own or control;</li>
                  <li>Create a strong, unique password that you do not use for other services;</li>
                  <li>Enable two-factor authentication (2FA) if available and recommended;</li>
                  <li>Not share your Account credentials with any third party;</li>
                  <li>Accept full responsibility for all activities that occur under your Account;</li>
                  <li>Notify us immediately at security@k9protrain.com upon discovering any unauthorized access or security breach.</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">3.3 Account Types and Roles</h3>
                <p>The Service offers different account types with varying permissions and capabilities:</p>

                <h4 className="text-md font-medium text-white mt-4">Facility/Trainer Accounts</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Primary accounts for professional dog training businesses and individual trainers</li>
                  <li>Full access to training management, client communication, and reporting features</li>
                  <li>Ability to create and manage Staff Member accounts</li>
                  <li>Access to billing and subscription management</li>
                  <li>Responsible for all activity under associated Staff accounts</li>
                </ul>

                <h4 className="text-md font-medium text-white mt-4">Staff Member Accounts</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Created by and subordinate to a Facility/Trainer Account</li>
                  <li>Permissions determined by the Facility administrator</li>
                  <li>May include roles such as: Administrator, Senior Trainer, Trainer, Assistant, Front Desk, View Only</li>
                  <li>Activity logged and auditable by Facility administrator</li>
                </ul>

                <h4 className="text-md font-medium text-white mt-4">Pet Parent Accounts</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>For dog owners receiving training services from a connected Facility</li>
                  <li>Access to view their dog's profile, training progress, and daily reports</li>
                  <li>Ability to communicate with assigned trainers</li>
                  <li>Access to homework assignments and certificates</li>
                  <li>Cannot create or modify training records (view only)</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">3.4 Account Verification</h3>
                <p>
                  We may require verification of your identity, business credentials, or other information at any time. This may include email verification, phone verification, business license verification for Facilities, or identity document verification. Failure to complete required verification may result in limited access or Account suspension.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">3.5 Account Security</h3>
                <p>
                  You are solely responsible for maintaining the confidentiality and security of your Account credentials. We will never ask for your password via email or phone. If you believe your Account has been compromised, you must immediately: (1) change your password, (2) revoke any active sessions, and (3) notify us at security@k9protrain.com.
                </p>
              </div>
            </section>

            {/* Section 4: Service Description */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Description of Service</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">4.1 Platform Overview</h3>
                <p>
                  K9 ProTrain is a comprehensive software-as-a-service (SaaS) platform designed to help professional dog trainers, training facilities, and pet service businesses manage their operations, track training progress, communicate with clients, and grow their businesses. The Service is provided via web browsers and mobile applications.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">4.2 Core Features</h3>
                <p>Subject to your Subscription level, the Service includes the following features:</p>

                <h4 className="text-md font-medium text-white mt-4">Dog Management</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Comprehensive dog profiles with photos, breed information, and physical characteristics</li>
                  <li>Medical and vaccination record storage</li>
                  <li>Behavioral assessments and temperament tracking</li>
                  <li>Emergency contact and veterinarian information</li>
                  <li>Intake forms and client questionnaires</li>
                </ul>

                <h4 className="text-md font-medium text-white mt-4">Training & Activity Tracking</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Session logging with detailed notes and timestamps</li>
                  <li>Activity tracking (feeding, walks, playtime, rest, medications)</li>
                  <li>Progress tracking with skill assessments and ratings</li>
                  <li>Custom activity types and categories</li>
                  <li>Batch logging for multiple dogs</li>
                </ul>

                <h4 className="text-md font-medium text-white mt-4">Client Communication</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Daily report generation with photos and videos</li>
                  <li>In-app messaging between trainers and pet parents</li>
                  <li>Automated notifications and reminders</li>
                  <li>Report card and progress summary generation</li>
                </ul>

                <h4 className="text-md font-medium text-white mt-4">Achievements & Credentials</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Digital badge system for training milestones</li>
                  <li>Certificate generation and customization</li>
                  <li>Achievement tracking and display</li>
                  <li>Shareable credentials for social media</li>
                </ul>

                <h4 className="text-md font-medium text-white mt-4">Business Operations</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Staff management and role-based permissions</li>
                  <li>Scheduling and calendar management</li>
                  <li>Homework assignment and tracking</li>
                  <li>Video library for training resources</li>
                  <li>Analytics and reporting dashboards</li>
                </ul>

                <h4 className="text-md font-medium text-white mt-4">Pet Parent Portal</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Real-time access to dog's daily activities</li>
                  <li>Photo and video viewing</li>
                  <li>Progress tracking and milestone celebrations</li>
                  <li>Direct communication with trainers</li>
                  <li>Homework completion tracking</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">4.3 Service Modifications</h3>
                <p>
                  We continuously improve and update the Service. We reserve the right to modify, update, add, or remove features at any time. For material changes that negatively affect your use of the Service, we will provide at least thirty (30) days' notice when practicable. Minor updates, bug fixes, and security patches may be deployed without prior notice.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">4.4 Third-Party Integrations</h3>
                <p>
                  The Service may integrate with or provide access to third-party services, including but not limited to payment processors (Stripe), cloud storage providers, calendar services, and communication platforms. Your use of third-party services is subject to their respective terms and privacy policies. We are not responsible for third-party services.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">4.5 Mobile Applications</h3>
                <p>
                  The Service is available through mobile applications for iOS and Android devices. Your use of mobile applications is subject to these Terms and any additional terms imposed by the applicable app store (Apple App Store, Google Play Store). Mobile app features may vary from the web version.
                </p>
              </div>
            </section>

            {/* Section 5: Subscription Tiers */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Subscription Plans and Features</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">5.1 Available Plans</h3>
                <p>We offer the following subscription tiers. Features and pricing are subject to change with notice:</p>

                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-sm border border-surface-700 rounded-lg">
                    <thead className="bg-surface-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-white">Plan</th>
                        <th className="px-4 py-3 text-left text-white">Price</th>
                        <th className="px-4 py-3 text-left text-white">Dogs</th>
                        <th className="px-4 py-3 text-left text-white">Staff</th>
                        <th className="px-4 py-3 text-left text-white">Key Features</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-700">
                      <tr>
                        <td className="px-4 py-3 font-medium text-white">Free</td>
                        <td className="px-4 py-3">$0/mo</td>
                        <td className="px-4 py-3">Up to 5</td>
                        <td className="px-4 py-3">1</td>
                        <td className="px-4 py-3">Basic tracking, limited reports</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-white">Starter</td>
                        <td className="px-4 py-3">$79/mo</td>
                        <td className="px-4 py-3">Up to 25</td>
                        <td className="px-4 py-3">3</td>
                        <td className="px-4 py-3">Daily reports, pet parent portal, badges</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-white">Professional</td>
                        <td className="px-4 py-3">$149/mo</td>
                        <td className="px-4 py-3">Up to 75</td>
                        <td className="px-4 py-3">10</td>
                        <td className="px-4 py-3">Video library, homework, certificates, analytics</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-white">Enterprise</td>
                        <td className="px-4 py-3">$249/mo</td>
                        <td className="px-4 py-3">Unlimited</td>
                        <td className="px-4 py-3">Unlimited</td>
                        <td className="px-4 py-3">Multi-location, API access, priority support, custom branding</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-medium text-white mt-6">5.2 Annual Billing Discount</h3>
                <p>
                  Annual subscriptions are available at a discount of approximately 17% compared to monthly billing. Annual subscriptions are billed in full at the start of each annual term.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">5.3 Plan Upgrades and Downgrades</h3>
                <p>
                  You may upgrade your plan at any time. Upgrades take effect immediately, and you will be charged a prorated amount for the remainder of your current billing period. Downgrades take effect at the start of your next billing period. When downgrading, features exceeding your new plan limits may become inaccessible.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">5.4 Exceeding Plan Limits</h3>
                <p>
                  If you exceed the limits of your current plan (dogs, staff members, storage), you will be notified and given the option to upgrade. Continued use beyond limits may result in temporary feature restrictions until you upgrade or reduce usage.
                </p>
              </div>
            </section>

            {/* Section 6: Billing and Payments */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Billing, Payments, and Refunds</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">6.1 Payment Processing</h3>
                <p>
                  All payments are processed securely through Stripe, Inc. By providing payment information, you authorize us and our payment processor to charge your designated payment method for all applicable fees. We do not store complete credit card numbers on our servers.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">6.2 Billing Cycle</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Monthly Subscriptions:</strong> Billed on the same calendar day each month (or the last day of the month if applicable)</li>
                  <li><strong className="text-white">Annual Subscriptions:</strong> Billed on the anniversary of your subscription start date</li>
                  <li><strong className="text-white">Free Trials:</strong> Automatically convert to paid subscriptions unless cancelled before trial expiration</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">6.3 Automatic Renewal</h3>
                <p className="font-semibold text-amber-400">
                  ALL SUBSCRIPTIONS AUTOMATICALLY RENEW AT THE END OF EACH BILLING PERIOD UNLESS YOU CANCEL BEFORE THE RENEWAL DATE. You authorize us to charge your payment method for each renewal period until you cancel.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">6.4 Failed Payments</h3>
                <p>If a payment fails, we will:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Notify you by email of the failed payment</li>
                  <li>Attempt to charge your payment method again after 3 days</li>
                  <li>Attempt a final charge after 7 days</li>
                  <li>Suspend your account after 14 days of non-payment</li>
                  <li>Terminate your account after 30 days of non-payment (data retained for 90 days)</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">6.5 Taxes</h3>
                <p>
                  All fees are exclusive of applicable taxes. You are responsible for paying all sales, use, VAT, GST, and other taxes imposed by any jurisdiction on the Service, excluding taxes based on our net income. If we are required to collect taxes, they will be added to your invoice.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">6.6 Price Changes</h3>
                <p>
                  We may modify our pricing at any time. For existing subscribers, price changes will take effect at the start of the next billing period following at least thirty (30) days' notice. Your continued use after a price change constitutes acceptance of the new pricing.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">6.7 Refund Policy</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Monthly Subscriptions:</strong> Non-refundable. You retain access until the end of your paid period.</li>
                  <li><strong className="text-white">Annual Subscriptions:</strong> Eligible for a prorated refund if requested within thirty (30) days of initial purchase or renewal, less any discounts received.</li>
                  <li><strong className="text-white">Free Trials:</strong> No charge; no refund applicable.</li>
                  <li><strong className="text-white">Discretionary Refunds:</strong> We may, at our sole discretion, issue refunds in exceptional circumstances.</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">6.8 Promotional Offers and Discounts</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Promotional codes must be applied at checkout and cannot be applied retroactively</li>
                  <li>Promotions cannot be combined unless explicitly stated</li>
                  <li>We reserve the right to modify or cancel promotions at any time</li>
                  <li>Promotional pricing applies only for the specified term; standard pricing applies thereafter</li>
                  <li>Abuse of promotional offers may result in Account suspension</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">6.9 Disputes and Chargebacks</h3>
                <p>
                  If you believe a charge is incorrect, please contact us at billing@k9protrain.com within sixty (60) days. Filing a chargeback or payment dispute without first contacting us may result in Account suspension pending resolution.
                </p>
              </div>
            </section>

            {/* Section 7: Cancellation */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Cancellation and Termination</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">7.1 Cancellation by You</h3>
                <p>
                  You may cancel your Subscription at any time through your Account settings or by contacting support@k9protrain.com. Cancellation will be effective at the end of your current billing period. You will retain full access to the Service until that date.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">7.2 Effect of Cancellation</h3>
                <p>Upon cancellation:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your Account will revert to Free tier limitations (if applicable) or be deactivated</li>
                  <li>You will have thirty (30) days to export your data</li>
                  <li>After ninety (90) days, your data may be permanently deleted</li>
                  <li>Any unused portion of prepaid fees is non-refundable (except as stated in Section 6.7)</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">7.3 Termination by Us</h3>
                <p>We may suspend or terminate your Account immediately, with or without notice, if:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You breach any provision of these Terms;</li>
                  <li>You fail to pay applicable fees after the grace period;</li>
                  <li>We reasonably believe you are engaged in fraudulent, illegal, or harmful activity;</li>
                  <li>Your use of the Service poses a security risk or may cause harm to other users;</li>
                  <li>We are required to do so by law or legal process;</li>
                  <li>We discontinue the Service (with reasonable notice where possible).</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">7.4 Data Export</h3>
                <p>
                  Prior to cancellation or termination, you may request an export of your User Data. We will provide your data in a commonly used, machine-readable format (such as JSON or CSV) within thirty (30) days of your request. After Account termination, data export requests may be subject to a reasonable fee.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">7.5 Survival</h3>
                <p>
                  Sections that by their nature should survive termination will survive, including but not limited to: Definitions, Intellectual Property, Disclaimers, Limitation of Liability, Indemnification, Dispute Resolution, and General Provisions.
                </p>
              </div>
            </section>

            {/* Section 8: User Conduct */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. User Conduct and Acceptable Use</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">8.1 General Conduct Requirements</h3>
                <p>You agree to use the Service in a manner consistent with all applicable laws and these Terms. You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Service for any unlawful purpose or in violation of any applicable laws;</li>
                  <li>Violate or infringe the rights of others, including privacy, publicity, or intellectual property rights;</li>
                  <li>Upload, post, or transmit any Content that is harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable;</li>
                  <li>Impersonate any person or entity or falsely represent your affiliation;</li>
                  <li>Transmit any Malicious Code, viruses, or harmful software;</li>
                  <li>Attempt to gain unauthorized access to any systems, networks, or other user accounts;</li>
                  <li>Interfere with or disrupt the Service, servers, or networks;</li>
                  <li>Use automated means (bots, scrapers, crawlers) to access the Service without express permission;</li>
                  <li>Reverse engineer, decompile, or disassemble any part of the Service;</li>
                  <li>Circumvent any access controls, rate limits, or security measures;</li>
                  <li>Resell, sublicense, or commercially exploit the Service without authorization;</li>
                  <li>Use the Service to send unsolicited communications (spam);</li>
                  <li>Engage in any activity that could damage, disable, or impair the Service.</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">8.2 Content Standards</h3>
                <p>All Content you upload, share, or transmit through the Service must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be accurate, truthful, and not misleading;</li>
                  <li>Not infringe any third-party intellectual property, privacy, or other rights;</li>
                  <li>Not be defamatory, libelous, or maliciously false;</li>
                  <li>Not be obscene, pornographic, or sexually explicit;</li>
                  <li>Not promote violence, hatred, or discrimination;</li>
                  <li>Not depict or encourage animal cruelty, abuse, or neglect;</li>
                  <li>Not contain personal information of others without their consent;</li>
                  <li>Comply with all applicable laws, regulations, and industry standards.</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">8.3 Animal Welfare Standards</h3>
                <p>
                  K9 ProTrain is committed to the humane treatment of all animals. Users of the Service agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Comply with all applicable animal welfare laws, regulations, and local ordinances;</li>
                  <li>Use only humane, positive, and evidence-based training methods;</li>
                  <li>Never upload Content depicting or promoting animal cruelty, abuse, neglect, or harm;</li>
                  <li>Report any suspected animal abuse or neglect to appropriate authorities;</li>
                  <li>Ensure all dogs in their care receive proper nutrition, shelter, veterinary care, and enrichment;</li>
                  <li>Not use the Service to facilitate illegal activities involving animals (dogfighting, etc.).</li>
                </ul>
                <p className="mt-4 font-semibold text-red-400">
                  Violation of animal welfare standards will result in immediate Account termination and may be reported to law enforcement authorities.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">8.4 Professional Standards for Trainers</h3>
                <p>Trainers and Facilities using the Service represent and warrant that they:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Possess appropriate qualifications, training, and experience to provide dog training services;</li>
                  <li>Hold all required licenses, permits, and certifications for their jurisdiction;</li>
                  <li>Maintain appropriate insurance coverage (general liability, professional liability);</li>
                  <li>Follow industry best practices and ethical standards;</li>
                  <li>Accurately represent their credentials, certifications, and experience;</li>
                  <li>Provide services in a professional and competent manner;</li>
                  <li>Maintain appropriate facility standards (cleanliness, safety, ventilation).</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">8.5 Monitoring and Enforcement</h3>
                <p>
                  We reserve the right, but not the obligation, to monitor Content and user activity for compliance with these Terms. We may, in our sole discretion, remove any Content, suspend accounts, or take other action we deem necessary. We are not responsible for any failure to remove objectionable Content.
                </p>
              </div>
            </section>

            {/* Section 9: User-Generated Content */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. User-Generated Content</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">9.1 Ownership of Your Content</h3>
                <p>
                  You retain full ownership of all Content you upload to the Service. We do not claim ownership of your photos, videos, training records, or other User Data. Your Content remains yours.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">9.2 License Grant to Us</h3>
                <p>
                  By uploading Content to the Service, you grant us a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform, and display your Content solely for the purposes of:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Operating, providing, and improving the Service;</li>
                  <li>Displaying Content to intended recipients (pet parents, trainers, staff);</li>
                  <li>Generating reports, certificates, and badges as directed by you;</li>
                  <li>Providing customer support;</li>
                  <li>Creating anonymized, aggregated analytics (with no personally identifiable information).</li>
                </ul>
                <p className="mt-4">
                  This license terminates when you delete your Content or Account, except for Content that has been shared with others, included in backups, or that we are required to retain by law.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">9.3 License Grant to Other Users</h3>
                <p>
                  When you share Content with other users (e.g., sending daily reports to pet parents, sharing training videos with clients), you grant those users a limited, non-exclusive license to view, download for personal use, and share that Content as permitted by the Service's functionality.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">9.4 Your Representations</h3>
                <p>By uploading Content, you represent and warrant that:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You own the Content or have all necessary rights and permissions to upload it;</li>
                  <li>The Content does not violate any third-party rights (copyright, trademark, privacy);</li>
                  <li>You have obtained consent from any individuals depicted in photos or videos;</li>
                  <li>The Content is accurate and not misleading;</li>
                  <li>The Content complies with all applicable laws and these Terms.</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">9.5 Content Removal</h3>
                <p>
                  We may remove or disable access to any Content that we believe, in our sole discretion, violates these Terms, infringes third-party rights, or is otherwise objectionable. We will make reasonable efforts to notify you of removal, but may act without notice in urgent situations.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">9.6 DMCA Copyright Policy</h3>
                <p>
                  We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). If you believe your copyrighted work has been infringed, please send a notice to our designated DMCA agent:
                </p>
                <div className="p-4 bg-surface-800 rounded-lg mt-2">
                  <p><strong>DMCA Agent</strong></p>
                  <p>Lazy E Holdings LLC</p>
                  <p>Email: dmca@k9protrain.com</p>
                </div>
                <p className="mt-4">Your notice must include:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A physical or electronic signature of the copyright owner or authorized agent;</li>
                  <li>Identification of the copyrighted work claimed to be infringed;</li>
                  <li>Identification of the infringing material and its location on the Service;</li>
                  <li>Your contact information (address, phone number, email);</li>
                  <li>A statement that you have a good faith belief the use is not authorized;</li>
                  <li>A statement under penalty of perjury that the information is accurate.</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">9.7 Counter-Notification</h3>
                <p>
                  If you believe your Content was wrongly removed due to a DMCA notice, you may submit a counter-notification with: your signature, identification of the removed material, a statement under penalty of perjury that removal was a mistake, and your consent to jurisdiction. We will forward counter-notifications to the complaining party.
                </p>
              </div>
            </section>

            {/* Section 10: Service Levels */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Service Availability and Support</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">10.1 Availability Target</h3>
                <p>
                  We strive to maintain Service availability of 99.9% uptime, measured monthly, excluding scheduled maintenance windows and factors outside our reasonable control. This is a target, not a guarantee. The Service is provided on an "as available" basis.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">10.2 Scheduled Maintenance</h3>
                <p>
                  We perform scheduled maintenance during low-traffic periods, typically Sunday mornings (US Central Time). We will provide at least 24 hours' notice for planned maintenance expected to exceed 15 minutes. Emergency maintenance may be performed without notice.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">10.3 Customer Support</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Free/Starter:</strong> Email support, response within 48 business hours</li>
                  <li><strong className="text-white">Professional:</strong> Email support, response within 24 business hours</li>
                  <li><strong className="text-white">Enterprise:</strong> Priority email and phone support, response within 4 business hours, dedicated account manager</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">10.4 Data Backup</h3>
                <p>
                  We perform regular backups of User Data for disaster recovery purposes. Backups are retained for 30 days. While we take reasonable precautions, we do not guarantee data recovery in all circumstances. You are responsible for maintaining your own backups of critical data.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">10.5 Service Credits (Enterprise Only)</h3>
                <p>
                  Enterprise customers may be eligible for service credits if monthly uptime falls below 99.9%, subject to the terms of their Enterprise agreement. Credits are the sole and exclusive remedy for downtime.
                </p>
              </div>
            </section>

            {/* Sections 11-27 continue in a similar comprehensive fashion */}
            {/* Section 11: Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Intellectual Property Rights</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">11.1 Our Intellectual Property</h3>
                <p>
                  The Service, including all software, code, algorithms, designs, text, graphics, logos, icons, images, audio clips, video clips, data compilations, page layout, underlying code, and software, is owned by Lazy E Holdings LLC or our licensors and is protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">11.2 Trademarks</h3>
                <p>
                  "K9 ProTrain," "Lazy E Holdings," our logos, and other marks are trademarks or registered trademarks of Lazy E Holdings LLC. You may not use our trademarks without prior written consent, except as necessary to accurately refer to the Service.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">11.3 License to Use the Service</h3>
                <p>
                  Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your internal business or personal purposes. This license does not include the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Modify, adapt, or create derivative works of the Service;</li>
                  <li>Reverse engineer, decompile, or disassemble the Service;</li>
                  <li>Rent, lease, sell, sublicense, or transfer the Service;</li>
                  <li>Remove any proprietary notices or labels;</li>
                  <li>Use the Service to build a competing product.</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">11.4 Feedback</h3>
                <p>
                  If you provide feedback, suggestions, ideas, or recommendations regarding the Service ("Feedback"), you grant us a perpetual, irrevocable, worldwide, royalty-free license to use, modify, and incorporate such Feedback into the Service without any obligation to you. You waive any "moral rights" in such Feedback.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">11.5 Reservation of Rights</h3>
                <p>
                  All rights not expressly granted in these Terms are reserved by Lazy E Holdings LLC. Nothing in these Terms shall be construed as granting any license or right under any patent or trademark.
                </p>
              </div>
            </section>

            {/* Section 12: API Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. API and Developer Terms</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">12.1 API Access</h3>
                <p>
                  API access is available to Enterprise tier subscribers. API usage is subject to these Terms, any separate API documentation, and rate limits we establish. We may modify API specifications with reasonable notice.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">12.2 API Credentials</h3>
                <p>
                  You are responsible for maintaining the security of API keys and credentials. You must immediately notify us and rotate credentials if you suspect any unauthorized access. Do not embed API keys in client-side code.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">12.3 Rate Limits</h3>
                <p>
                  API usage is subject to rate limits as specified in the API documentation. Exceeding rate limits may result in throttling or temporary suspension of API access. Contact us for higher rate limits if needed.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">12.4 Prohibited API Uses</h3>
                <p>You may not use the API to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Build a product or service that competes with K9 ProTrain;</li>
                  <li>Resell API access to third parties;</li>
                  <li>Access data beyond your authorized scope;</li>
                  <li>Circumvent security measures or rate limits;</li>
                  <li>Aggregate data from multiple accounts without explicit authorization.</li>
                </ul>
              </div>
            </section>

            {/* Section 13: Beta Features */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Beta Features and Early Access</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">13.1 Beta Program</h3>
                <p>
                  We may invite you to participate in beta testing of new features ("Beta Features"). Beta Features are provided "as is" without any warranties. We may discontinue Beta Features at any time without notice.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">13.2 Beta Feedback</h3>
                <p>
                  By participating in beta testing, you agree to provide feedback and may be contacted for surveys or interviews. All feedback is subject to Section 11.4.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">13.3 Confidentiality</h3>
                <p>
                  Beta Features may be confidential. You agree not to disclose information about Beta Features to third parties without our prior written consent.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">13.4 No Guarantee of Release</h3>
                <p>
                  Participation in beta testing does not guarantee that Beta Features will be released generally or that they will function the same way upon release.
                </p>
              </div>
            </section>

            {/* Section 14: Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Privacy and Data Protection</h2>
              <div className="text-surface-300 space-y-4">
                <p>
                  Your privacy is important to us. Please review our <Link href="/privacy" className="text-brand-400 hover:text-brand-300 underline">Privacy Policy</Link>, which describes how we collect, use, store, and share your personal information. The Privacy Policy is incorporated into these Terms by reference.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">14.1 Your Privacy Responsibilities</h3>
                <p>If you are a Trainer or Facility, you may collect personal information from Pet Parents. You represent and warrant that you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Have obtained all necessary consents to input personal data into the Service;</li>
                  <li>Will comply with all applicable privacy laws (CCPA, GDPR if applicable);</li>
                  <li>Have your own privacy policy that accurately describes your data practices;</li>
                  <li>Will only use personal information for legitimate business purposes;</li>
                  <li>Will promptly respond to data subject access requests.</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">14.2 Data Processing</h3>
                <p>
                  For business users subject to GDPR or similar laws, we will process personal data on your behalf as a "data processor." A Data Processing Agreement is available upon request.
                </p>
              </div>
            </section>

            {/* Section 15: Third-Party Services */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">15. Third-Party Services and Links</h2>
              <div className="text-surface-300 space-y-4">
                <p>
                  The Service integrates with and may contain links to third-party services. These include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Payment Processing:</strong> Stripe, Inc.</li>
                  <li><strong className="text-white">Cloud Infrastructure:</strong> Supabase, Vercel</li>
                  <li><strong className="text-white">Authentication:</strong> Google, Apple (for social login)</li>
                  <li><strong className="text-white">Analytics:</strong> Various analytics providers</li>
                </ul>
                <p className="mt-4">
                  Your use of third-party services is governed by their respective terms and privacy policies. We are not responsible for third-party services, their content, or their practices. Any transactions with third parties are solely between you and that third party.
                </p>
              </div>
            </section>

            {/* Section 16: Disclaimers */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">16. Disclaimers</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">16.1 "As Is" Basis</h3>
                <p className="uppercase text-sm">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND THOSE ARISING FROM COURSE OF DEALING OR USAGE OF TRADE.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">16.2 No Professional Advice</h3>
                <p>
                  The Service provides software tools for dog training management. It does not constitute and should not be relied upon as professional veterinary, medical, behavioral, or legal advice. Always consult qualified professionals for specific advice regarding your dog's health, behavior, or training needs.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">16.3 No Endorsement of Trainers</h3>
                <p>
                  We do not employ, endorse, certify, or guarantee any Trainer or Facility using the Service. We are a software platform, not a training service provider. We do not verify trainer credentials, qualifications, or insurance. You are solely responsible for selecting trainers and evaluating their qualifications.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">16.4 Training Outcomes</h3>
                <p>
                  We make no guarantees regarding training outcomes, dog behavior, or the effectiveness of any training methods. Results vary based on many factors including the dog, trainer skill, consistency, and environmental factors.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">16.5 Third-Party Content</h3>
                <p>
                  We do not control, endorse, or assume responsibility for any Content provided by users or third parties. User-generated content may be inaccurate, offensive, or harmful.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">16.6 No Warranty of Accuracy</h3>
                <p>
                  While we strive for accuracy, we do not warrant that information on the Service is complete, accurate, reliable, current, or error-free.
                </p>
              </div>
            </section>

            {/* Section 17: Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">17. Limitation of Liability</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">17.1 Exclusion of Certain Damages</h3>
                <p className="uppercase text-sm">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LAZY E HOLDINGS LLC, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 space-y-1 normal-case mt-2">
                  <li>Loss of profits, revenue, or business opportunities;</li>
                  <li>Loss of data or data corruption;</li>
                  <li>Loss of goodwill or reputation;</li>
                  <li>Cost of procurement of substitute services;</li>
                  <li>Business interruption;</li>
                  <li>Personal injury or property damage;</li>
                  <li>Any injury, harm, or death of any animal;</li>
                  <li>Any other intangible losses;</li>
                </ul>
                <p className="uppercase text-sm mt-4">
                  WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">17.2 Liability Cap</h3>
                <p className="uppercase text-sm">
                  OUR TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF: (A) ONE HUNDRED U.S. DOLLARS ($100.00); OR (B) THE TOTAL FEES YOU PAID TO US DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">17.3 Jurisdictional Limitations</h3>
                <p>
                  Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages. In such jurisdictions, our liability shall be limited to the fullest extent permitted by applicable law.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">17.4 Essential Purpose</h3>
                <p>
                  The limitations in this section apply even if any limited remedy fails of its essential purpose. You acknowledge that these limitations are a fundamental part of the bargain between us.
                </p>
              </div>
            </section>

            {/* Section 18: Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">18. Indemnification</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">18.1 Your Indemnification Obligations</h3>
                <p>
                  You agree to defend, indemnify, and hold harmless Lazy E Holdings LLC and its Affiliates, officers, directors, employees, agents, successors, and assigns from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your violation of these Terms or any applicable law;</li>
                  <li>Your Content or User Data;</li>
                  <li>Your use or misuse of the Service;</li>
                  <li>Your violation of any third-party rights;</li>
                  <li>Any dog training or pet services you provide;</li>
                  <li>Any injury, harm, or damage caused by any dog under your care or ownership;</li>
                  <li>Any dispute between you and a Pet Parent, Trainer, or other user;</li>
                  <li>Your breach of any representation or warranty in these Terms;</li>
                  <li>Any claims by your employees, contractors, or Authorized Users.</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">18.2 Indemnification Procedure</h3>
                <p>
                  We will notify you promptly of any claim subject to indemnification. You shall have sole control of the defense and settlement of such claims, provided that you may not settle any claim that imposes obligations on us or admits fault without our prior written consent.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">18.3 Our Participation</h3>
                <p>
                  We reserve the right, at our own expense, to participate in the defense of any claim subject to indemnification. You shall cooperate fully with us in asserting any available defenses.
                </p>
              </div>
            </section>

            {/* Section 19: Insurance */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">19. Insurance Requirements</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">19.1 Trainer and Facility Insurance</h3>
                <p>
                  Trainers and Facilities using the Service are <strong className="text-white">strongly encouraged</strong> to maintain the following insurance coverages at their own expense:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Commercial General Liability:</strong> Minimum $1,000,000 per occurrence / $2,000,000 aggregate</li>
                  <li><strong className="text-white">Professional Liability (E&O):</strong> Minimum $500,000 per occurrence</li>
                  <li><strong className="text-white">Care, Custody, and Control:</strong> Minimum $50,000 per animal / $250,000 aggregate</li>
                  <li><strong className="text-white">Workers' Compensation:</strong> As required by applicable law</li>
                  <li><strong className="text-white">Commercial Auto:</strong> If transporting animals, minimum $500,000 combined single limit</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">19.2 No Insurance Provided</h3>
                <p>
                  K9 ProTrain does not provide any insurance coverage to Trainers, Facilities, Pet Parents, or dogs. All insurance is your sole responsibility.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">19.3 Proof of Insurance</h3>
                <p>
                  We may request proof of insurance at any time. Failure to maintain adequate insurance is a violation of these Terms for Trainer/Facility accounts.
                </p>
              </div>
            </section>

            {/* Section 20: Export Compliance */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">20. Export Compliance and Government Use</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">20.1 Export Controls</h3>
                <p>
                  The Service may be subject to U.S. export control laws and regulations. You agree not to export, re-export, or transfer the Service to any country, entity, or person prohibited under applicable export laws, including U.S. Treasury Department OFAC sanctions.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">20.2 Compliance Representation</h3>
                <p>
                  You represent that you are not located in, under the control of, or a national or resident of any country subject to U.S. trade sanctions, and are not on any U.S. government restricted party list.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">20.3 Government Use</h3>
                <p>
                  If you are a U.S. government entity, the Service is provided as "Commercial Items" as defined in 48 C.F.R. §2.101. Government use is subject to these Terms with limited rights as set forth in 48 C.F.R. §12.212.
                </p>
              </div>
            </section>

            {/* Section 21: Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">21. Governing Law and Venue</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">21.1 Choice of Law</h3>
                <p>
                  These Terms and any dispute arising out of or relating to these Terms or the Service shall be governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law principles.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">21.2 Exclusive Venue</h3>
                <p>
                  Subject to the arbitration provisions in Section 22, any legal action or proceeding relating to these Terms or the Service shall be brought exclusively in the state or federal courts located in Travis County, Texas. You irrevocably consent to personal jurisdiction and venue in such courts.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">21.3 Waiver of Objections</h3>
                <p>
                  You waive any objection to jurisdiction or venue based on forum non conveniens or any other grounds.
                </p>
              </div>
            </section>

            {/* Section 22: Arbitration */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">22. Arbitration Agreement and Class Action Waiver</h2>
              <div className="text-surface-300 space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="font-semibold text-red-400 mb-2">PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.</p>
                </div>

                <h3 className="text-lg font-medium text-white mt-6">22.1 Agreement to Arbitrate</h3>
                <p>
                  You and Lazy E Holdings LLC mutually agree that any dispute, claim, or controversy arising out of or relating to these Terms, the Service, or any aspect of our relationship ("Disputes") shall be resolved exclusively through final and binding arbitration, rather than in court, except as set forth below.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">22.2 Arbitration Rules</h3>
                <p>
                  Arbitration shall be administered by the American Arbitration Association ("AAA") in accordance with its Commercial Arbitration Rules and the Supplementary Procedures for Consumer Related Disputes. The arbitration shall be conducted by a single arbitrator. The arbitrator's decision shall be final and binding.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">22.3 Arbitration Location</h3>
                <p>
                  Arbitration shall take place in Travis County, Texas, or, at your election, by telephone, video conference, or written submissions if the claim is for less than $10,000.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">22.4 Arbitration Costs</h3>
                <p>
                  Payment of arbitration fees shall be governed by AAA rules. For claims under $10,000, we will reimburse your filing fees and pay arbitrator fees if you prevail. We will not seek attorneys' fees from you in arbitration.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">22.5 Class Action Waiver</h3>
                <p className="uppercase font-semibold text-amber-400">
                  YOU AND WE AGREE THAT EACH PARTY MAY BRING DISPUTES ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS, COLLECTIVE, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING. THE ARBITRATOR MAY NOT CONSOLIDATE PROCEEDINGS OR PRESIDE OVER ANY CLASS, COLLECTIVE, OR REPRESENTATIVE PROCEEDING.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">22.6 Jury Trial Waiver</h3>
                <p className="uppercase">
                  IF FOR ANY REASON A DISPUTE PROCEEDS IN COURT RATHER THAN ARBITRATION, YOU AND WE EACH WAIVE ANY RIGHT TO A JURY TRIAL.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">22.7 Small Claims Exception</h3>
                <p>
                  Either party may bring an individual action in small claims court for Disputes within that court's jurisdiction, provided the matter remains in small claims court and proceeds only on an individual basis.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">22.8 Injunctive Relief Exception</h3>
                <p>
                  Nothing in this Section prevents either party from seeking injunctive or other equitable relief in court for claims related to intellectual property infringement, data security, or unauthorized access.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">22.9 Opt-Out Right</h3>
                <p>
                  You may opt out of this arbitration agreement by sending written notice to legal@k9protrain.com within thirty (30) days of first accepting these Terms. The notice must include your name, Account email, mailing address, and a clear statement that you wish to opt out of arbitration. Opting out does not affect any other provisions of these Terms.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">22.10 Severability</h3>
                <p>
                  If any part of this Section 22 is found unenforceable, the remainder shall continue to apply. If the Class Action Waiver is found unenforceable, the entire Section 22 shall be void.
                </p>
              </div>
            </section>

            {/* Section 23: General Provisions */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">23. General Provisions</h2>
              <div className="text-surface-300 space-y-4">
                <h3 className="text-lg font-medium text-white">23.1 Entire Agreement</h3>
                <p>
                  These Terms, together with the Privacy Policy and any other documents expressly incorporated by reference, constitute the entire agreement between you and Lazy E Holdings LLC regarding the Service and supersede all prior agreements, understandings, negotiations, and discussions.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">23.2 Amendment</h3>
                <p>
                  We may modify these Terms at any time. Material changes will be effective thirty (30) days after posting or notification. Your continued use after changes constitutes acceptance. We will maintain an archive of prior versions.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">23.3 Waiver</h3>
                <p>
                  Our failure to enforce any provision of these Terms shall not constitute a waiver of that provision or any other provision. Any waiver must be in writing and signed by us.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">23.4 Severability</h3>
                <p>
                  If any provision of these Terms is held invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">23.5 Assignment</h3>
                <p>
                  You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may assign these Terms without restriction, including in connection with a merger, acquisition, or sale of assets. Any attempted assignment in violation of this section is void.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">23.6 No Third-Party Beneficiaries</h3>
                <p>
                  These Terms do not create any third-party beneficiary rights. No person or entity not a party to these Terms shall have any right to enforce any provision hereof.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">23.7 Relationship of Parties</h3>
                <p>
                  Nothing in these Terms creates a partnership, joint venture, agency, franchise, or employment relationship. Neither party has authority to bind the other.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">23.8 Force Majeure</h3>
                <p>
                  Neither party shall be liable for any delay or failure to perform due to causes beyond its reasonable control, including acts of God, natural disasters, war, terrorism, riots, civil unrest, government actions, pandemics, epidemics, power failures, internet outages, labor disputes, or third-party service failures.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">23.9 Notices</h3>
                <p>
                  We may provide notices to you via email, in-app notification, or posting on the Service. You may provide notices to us at legal@k9protrain.com or by mail to: Lazy E Holdings LLC, Attn: Legal Department, [Address]. Notices are effective upon receipt (email) or posting (Service).
                </p>

                <h3 className="text-lg font-medium text-white mt-6">23.10 Electronic Communications</h3>
                <p>
                  By using the Service, you consent to receive electronic communications from us. You agree that all agreements, notices, disclosures, and other communications we provide electronically satisfy any legal requirement that such communications be in writing.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">23.11 Headings</h3>
                <p>
                  Section headings are for convenience only and shall not affect the interpretation of these Terms.
                </p>

                <h3 className="text-lg font-medium text-white mt-6">23.12 Language</h3>
                <p>
                  These Terms are written in English. Any translation is provided for convenience only. In case of conflict, the English version controls.
                </p>
              </div>
            </section>

            {/* Section 24: Changes */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">24. Changes to These Terms</h2>
              <div className="text-surface-300 space-y-4">
                <p>
                  We may update these Terms from time to time to reflect changes in our practices, the Service, or applicable law. When we make material changes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We will update the "Last Updated" date at the top of this page;</li>
                  <li>We will provide at least thirty (30) days' notice before the changes take effect;</li>
                  <li>We will notify you by email (for significant changes) or by posting a notice on the Service;</li>
                  <li>We may ask you to re-accept the Terms for material changes.</li>
                </ul>
                <p className="mt-4">
                  Your continued use of the Service after the effective date of any changes constitutes your acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using the Service and may cancel your Subscription.
                </p>
                <p className="mt-4">
                  We recommend reviewing these Terms periodically. Prior versions of these Terms are available upon request.
                </p>
              </div>
            </section>

            {/* Section 25: Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">25. Contact Information</h2>
              <div className="text-surface-300 space-y-4">
                <p>If you have questions about these Terms, please contact us:</p>
                <div className="p-6 rounded-xl bg-surface-800/50 border border-surface-700">
                  <p className="font-medium text-white text-lg mb-4">Lazy E Holdings LLC</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-surface-400">General Inquiries:</p>
                      <p className="text-white">info@k9protrain.com</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Legal Department:</p>
                      <p className="text-white">legal@k9protrain.com</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Customer Support:</p>
                      <p className="text-white">support@k9protrain.com</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Billing Inquiries:</p>
                      <p className="text-white">billing@k9protrain.com</p>
                    </div>
                    <div>
                      <p className="text-surface-400">DMCA Agent:</p>
                      <p className="text-white">dmca@k9protrain.com</p>
                    </div>
                    <div>
                      <p className="text-surface-400">Security Issues:</p>
                      <p className="text-white">security@k9protrain.com</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-surface-700">
                    <p className="text-surface-400">Mailing Address:</p>
                    <p className="text-white">Lazy E Holdings LLC</p>
                    <p className="text-white">Attn: Legal Department</p>
                    <p className="text-surface-400 text-sm mt-2">[Physical address available upon request]</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-surface-800">
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="text-brand-400 hover:text-brand-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/" className="text-surface-400 hover:text-white transition-colors">
                Back to Home
              </Link>
            </div>
            <p className="text-surface-500 text-xs mt-4">
              © {new Date().getFullYear()} Lazy E Holdings LLC. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
