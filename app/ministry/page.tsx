import GovHeader from '../../components/GovHeader';
import { Landmark } from 'lucide-react';

export default function MinistryPage() {
  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      <GovHeader />
      <main className="flex-1 max-w-[1400px] mx-auto w-full p-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 text-blue-600 p-4 rounded-full">
              <Landmark size={48} />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Ministry Details</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Information about the Ministry of Electronics &amp; Information Technology and other governing bodies responsible for scheme administration.
          </p>
        </div>
      </main>
    </div>
  );
}
