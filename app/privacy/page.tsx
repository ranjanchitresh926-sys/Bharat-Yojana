import React from 'react';
import GovHeader from '../../components/GovHeader';
import GovFooter from '../../components/GovFooter';

export const metadata = {
  title: 'Privacy Notice - Bharat Yojana',
  description: 'Privacy notice and consent policies for the Bharat Yojana portal.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <GovHeader />
      
      <main id="main-content" className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Notice</h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
            <p className="text-sm text-blue-900 font-medium">
              <strong>Disclaimer:</strong> This is a student Smart India Hackathon project. It is not affiliated with the Government of India. Do not submit real personal information.
            </p>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. What Information We Collect & Why</h2>
              <p>
                When you use the eligibility checker, your profile data (age, income, category, gender, occupation, state, landholding, and specific tags) is evaluated <strong>locally on your device</strong>. 
                This data is only transmitted to our servers if you explicitly choose to "Track Interest" in a specific scheme. 
              </p>
              <p className="mt-2">
                If you use the voice intake feature, your audio is recorded and securely transmitted to the <strong>Google Gemini API</strong> for transcription and extraction. The transcript is used solely to fill your profile locally.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Data Retention Policy</h2>
              <p>
                We do not store your data indefinitely. Our stated policy is to retain tracked applications and associated consent records for exactly <strong>30 days</strong> after they reach a final status (Approved or Rejected). Until an automated retention job is built, deletion is currently manual and handled exclusively upon request via the Grievance page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Your Rights & Consent Withdrawal</h2>
              <p>
                You have the right to access, correct, or delete your personal data at any time. Because this platform uses lightweight anonymous identifiers (unless you are staff), you can clear your local storage to disconnect your device from the tracked data.
              </p>
              <p className="mt-2">
                If you wish to formally withdraw consent for data we currently hold, or request a complete deletion of your records, you may do so through our Grievance Officer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Contact & Grievance</h2>
              <p>
                If you have concerns about how your data is being handled, or wish to exercise your data rights, please contact our Grievance Officer, the Project Maintainer, at <strong>privacy@bharatyojana.student.project.in</strong>, or submit a request directly via the form below.
              </p>
              <div className="mt-4">
                <a href="/grievance" className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-2.5 rounded transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-gray-900">
                  Contact Grievance Officer &rarr;
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  );
}
