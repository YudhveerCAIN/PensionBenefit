'use client';

import { useState } from 'react';

export default function TestPensionAPI() {
  const [formData, setFormData] = useState({
    age: '',
    origin: 'India',
    annualSalary: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({
        age: formData.age,
        origin: formData.origin,
        annualSalary: formData.annualSalary
      });

      const response = await fetch(`/api/pension-schemes?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pension schemes');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Pension Schemes API Test</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your age"
                  min="0"
                  max="120"
                  required
                />
              </div>

              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                  Origin *
                </label>
                <select
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="India">India</option>
                </select>
              </div>

              <div>
                <label htmlFor="annualSalary" className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Salary (₹) *
                </label>
                <input
                  type="number"
                  id="annualSalary"
                  name="annualSalary"
                  value={formData.annualSalary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter annual salary"
                  min="0"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Fetching Schemes...' : 'Get Pension Schemes'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Results</h2>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">User Profile:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-blue-800">
                <div><strong>Age:</strong> {result.userProfile.age}</div>
                <div><strong>Origin:</strong> {result.userProfile.origin}</div>
                <div><strong>Annual Salary:</strong> ₹{result.userProfile.annualSalary.toLocaleString()}</div>
                <div><strong>Monthly Salary:</strong> ₹{result.userProfile.monthlySalary.toLocaleString()}</div>
              </div>
            </div>

                         {/* Pension Insights */}
             {result.pensionInsights && (
               <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                 <h3 className="font-semibold text-blue-900 mb-3">Pension Summary</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                   <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                     <div className="text-2xl font-bold text-green-600">₹{result.pensionInsights.totalMonthlyPension.toLocaleString()}</div>
                     <div className="text-sm text-gray-600">Monthly Pension</div>
                   </div>
                   <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                     <div className="text-2xl font-bold text-blue-600">₹{result.pensionInsights.totalAnnualPension.toLocaleString()}</div>
                     <div className="text-sm text-gray-600">Annual Pension</div>
                   </div>
                   <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                     <div className="text-2xl font-bold text-purple-600">{((result.pensionInsights.totalAnnualPension / result.userProfile.annualSalary) * 100).toFixed(1)}%</div>
                     <div className="text-sm text-gray-600">Replacement Ratio</div>
                   </div>
                 </div>
                 
                 {result.pensionInsights.tips.length > 0 && (
                   <div className="mb-3">
                     <h4 className="font-medium text-blue-900 mb-2">💡 Tips:</h4>
                     <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                       {result.pensionInsights.tips.map((tip, index) => (
                         <li key={index}>{tip}</li>
                       ))}
                     </ul>
                   </div>
                 )}
                 
                 {result.pensionInsights.warnings.length > 0 && (
                   <div>
                     <h4 className="font-medium text-orange-900 mb-2">⚠️ Warnings:</h4>
                     <ul className="list-disc list-inside text-sm text-orange-800 space-y-1">
                       {result.pensionInsights.warnings.map((warning, index) => (
                         <li key={index}>{warning}</li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>
             )}

             <div className="mb-6">
               <h3 className="text-xl font-semibold text-gray-900 mb-4">
                 Eligible Pension Schemes ({result.totalSchemes})
               </h3>
               
               {result.schemes.length === 0 ? (
                 <p className="text-gray-600">No eligible pension schemes found for your profile.</p>
               ) : (
                 <div className="space-y-4">
                   {result.schemes.map((scheme, index) => (
                     <div key={scheme.scheme_id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-start mb-3">
                         <h4 className="text-lg font-semibold text-gray-900">{scheme.scheme_name}</h4>
                         <div className="flex gap-2">
                           <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                             Score: {scheme.relevanceScore}
                           </span>
                           {scheme.pensionCalculation && scheme.pensionCalculation.monthlyPension > 0 && (
                             <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                               ₹{scheme.pensionCalculation.monthlyPension.toLocaleString()}/month
                             </span>
                           )}
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                         <div>
                           <p className="text-sm text-gray-600"><strong>Category:</strong> {scheme.category}</p>
                           <p className="text-sm text-gray-600"><strong>Sector:</strong> {scheme.sector}</p>
                           <p className="text-sm text-gray-600"><strong>Administering Agency:</strong> {scheme.administering_agency}</p>
                         </div>
                         <div>
                           <p className="text-sm text-gray-600"><strong>Age Range:</strong> {scheme.eligibility_age_min}-{scheme.eligibility_age_max || "No limit"}</p>
                           <p className="text-sm text-gray-600"><strong>Contribution:</strong> {scheme.contribution_employee_pct}</p>
                           <p className="text-sm text-gray-600"><strong>Pension Formula:</strong> {scheme.pension_formula.substring(0, 100)}...</p>
                         </div>
                       </div>
                       
                       {/* Pension Calculation Display */}
                       {scheme.pensionCalculation && (
                         <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                           <h5 className="font-medium text-gray-900 mb-2">Pension Calculation:</h5>
                           <p className="text-sm text-gray-700 mb-2">{scheme.pensionCalculation.calculation}</p>
                           {scheme.pensionCalculation.type === 'epf_accumulation' && scheme.pensionCalculation.lumpSumCorpus && (
                             <p className="text-sm text-green-700 font-medium">
                               Lump Sum Corpus: ₹{scheme.pensionCalculation.lumpSumCorpus.toLocaleString()}
                             </p>
                           )}
                           {scheme.pensionCalculation.type === 'nps_market_linked' && (
                             <div className="text-sm text-green-700">
                               <p className="font-medium">Lump Sum: ₹{scheme.pensionCalculation.lumpSumCorpus.toLocaleString()}</p>
                               <p className="font-medium">Annuity Corpus: ₹{scheme.pensionCalculation.annuityCorpus.toLocaleString()}</p>
                             </div>
                           )}
                         </div>
                       )}
                       
                       <div className="bg-yellow-50 p-3 rounded">
                         <p className="text-sm text-yellow-800"><strong>Recommendation:</strong> {scheme.recommendation}</p>
                       </div>
                       
                       <div className="mt-3 flex gap-2">
                         <a 
                           href={scheme.official_info_links} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-sm text-blue-600 hover:text-blue-800 underline"
                         >
                           Official Info
                         </a>
                         <span className="text-gray-400">|</span>
                         <span className="text-sm text-gray-600">ID: {scheme.scheme_id}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>

            <div className="text-sm text-gray-500">
              <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
