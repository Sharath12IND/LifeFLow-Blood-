import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useRoute } from 'wouter';
import { BloodFact } from '@shared/schema';
import { Button } from '@/components/ui/button';
import BloodDropLogo from '@/components/BloodDropLogo';
import EmergencyAlert from '@/components/EmergencyAlert';

const BloodFactDetail: React.FC = () => {
  const [, params] = useRoute('/blood-facts/:slug');
  const slug = params?.slug || '';

  // Get all blood facts
  const { data: bloodFacts = [], isLoading } = useQuery<BloodFact[]>({
    queryKey: ['/api/blood-facts'],
  });

  // Find the specific blood fact by matching the slug from URL with the link path
  const bloodFact = bloodFacts.find(fact => {
    const linkPath = fact.link?.split('/').pop();
    return linkPath === slug;
  });

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-300 border-t-red-600"></div>
      </div>
    );
  }

  if (!bloodFact) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Blood Fact Not Found</h2>
        <p className="mt-4 text-gray-600">We couldn't find the information you were looking for.</p>
        <Link href="/">
          <Button className="mt-8">Go Home</Button>
        </Link>
      </div>
    );
  }

  const getContentBySlug = (slug: string): string => {
    // Extended content for each blood fact based on the slug
    switch (slug) {
      case 'compatibility':
        return `
          <h3>Understanding Blood Type Compatibility</h3>
          <p>Blood type compatibility is crucial for safe blood transfusions. Each blood type contains specific antigens that determine compatibility between donors and recipients.</p>
          
          <h4>Key Blood Type Facts:</h4>
          <ul>
            <li><strong>O-negative</strong> is the universal donor because it lacks A, B, and Rh antigens, making it compatible with all other blood types.</li>
            <li><strong>AB-positive</strong> is the universal recipient because it can accept any blood type.</li>
            <li>People with type O blood can only receive type O blood.</li>
            <li>People with type A blood can receive types A and O.</li>
            <li>People with type B blood can receive types B and O.</li>
            <li>People with type AB blood can receive all blood types.</li>
            <li>Rh-negative individuals should ideally receive Rh-negative blood.</li>
          </ul>
          
          <h4>Compatibility Chart:</h4>
          <table class="compatibility-table">
            <thead>
              <tr>
                <th>Blood Type</th>
                <th>Can Donate To</th>
                <th>Can Receive From</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>O-</td>
                <td>All blood types</td>
                <td>O-</td>
              </tr>
              <tr>
                <td>O+</td>
                <td>O+, A+, B+, AB+</td>
                <td>O+, O-</td>
              </tr>
              <tr>
                <td>A-</td>
                <td>A-, A+, AB-, AB+</td>
                <td>A-, O-</td>
              </tr>
              <tr>
                <td>A+</td>
                <td>A+, AB+</td>
                <td>A+, A-, O+, O-</td>
              </tr>
              <tr>
                <td>B-</td>
                <td>B-, B+, AB-, AB+</td>
                <td>B-, O-</td>
              </tr>
              <tr>
                <td>B+</td>
                <td>B+, AB+</td>
                <td>B+, B-, O+, O-</td>
              </tr>
              <tr>
                <td>AB-</td>
                <td>AB-, AB+</td>
                <td>AB-, A-, B-, O-</td>
              </tr>
              <tr>
                <td>AB+</td>
                <td>AB+ only</td>
                <td>All blood types</td>
              </tr>
            </tbody>
          </table>
        `;
      case 'intervals':
        return `
          <h3>Blood Donation Frequency and Intervals</h3>
          <p>Different blood donation types require different recovery periods. Following these guidelines ensures donor safety and optimal blood product quality.</p>
          
          <h4>Recommended Donation Intervals:</h4>
          <ul>
            <li><strong>Whole Blood:</strong> Every 56 days (8 weeks), up to 6 times per year</li>
            <li><strong>Double Red Cells:</strong> Every 112 days (16 weeks), up to 3 times per year</li>
            <li><strong>Platelets:</strong> Every 7 days, up to 24 times per year</li>
            <li><strong>Plasma:</strong> Every 28 days (4 weeks), up to 13 times per year</li>
          </ul>
          
          <h4>Why Intervals Matter:</h4>
          <p>Your body needs time to replenish blood components after donation:</p>
          <ul>
            <li>Red blood cells take about 4-6 weeks to regenerate completely</li>
            <li>Plasma replenishes within 48 hours</li>
            <li>Platelets restore within 3-5 days</li>
          </ul>
          
          <h4>Factors That May Affect Donation Eligibility:</h4>
          <ul>
            <li>Recent surgeries or medical procedures</li>
            <li>Certain medications</li>
            <li>Travel to specific regions</li>
            <li>Pregnancy (must wait 6 weeks after delivery)</li>
            <li>Iron levels (ferritin) below recommended thresholds</li>
          </ul>
          
          <p>Always check with your blood donation center about your specific eligibility and recommended intervals based on your health history and previous donations.</p>
        `;
      case 'benefits':
        return `
          <h3>Health Benefits of Regular Blood Donation</h3>
          <p>Regular blood donation not only helps others but also offers several health benefits to donors.</p>
          
          <h4>Physical Health Benefits:</h4>
          <ul>
            <li><strong>Reduced Iron Levels:</strong> Helps prevent hemochromatosis (iron overload), which can damage organs like the heart and liver</li>
            <li><strong>Reduced Heart Disease Risk:</strong> Studies suggest regular blood donors have a lower risk of heart attacks and cardiovascular disease</li>
            <li><strong>Stimulated Blood Cell Production:</strong> Donating promotes the production of new blood cells, keeping your body refreshed</li>
            <li><strong>Lower Cancer Risk:</strong> Reduced iron stores may be associated with lower cancer risk according to some research</li>
            <li><strong>Caloric Burn:</strong> You can burn approximately 650 calories by donating one pint of blood</li>
            <li><strong>Free Health Screening:</strong> Each donation includes mini-health checks including blood pressure, hemoglobin, pulse, and temperature</li>
          </ul>
          
          <h4>Mental Health Benefits:</h4>
          <ul>
            <li><strong>Psychological Satisfaction:</strong> The knowledge that your donation directly helps save lives</li>
            <li><strong>Reduced Stress:</strong> The act of giving has been linked to reduced stress levels and improved mood</li>
            <li><strong>Community Connection:</strong> Being part of a collective effort to help others creates social bonds</li>
          </ul>
          
          <h4>Important Considerations:</h4>
          <p>While blood donation has benefits, it's not appropriate for everyone. Those with certain medical conditions or who are severely anemic should not donate. Always consult healthcare professionals if you have concerns about how donation might affect your health.</p>
        `;
      case 'eligibility':
        return `
          <h3>Blood Donation Eligibility Requirements</h3>
          <p>Blood donation centers maintain specific eligibility criteria to ensure both donor and recipient safety.</p>
          
          <h4>Basic Requirements:</h4>
          <ul>
            <li><strong>Age:</strong> Generally 17-65 years (16 with parental consent in some regions, and over 65 with doctor's approval)</li>
            <li><strong>Weight:</strong> At least 110 pounds (50 kg)</li>
            <li><strong>Health Status:</strong> Overall good health on donation day</li>
            <li><strong>Hemoglobin Levels:</strong> Minimum 12.5 g/dL for women and 13.0 g/dL for men</li>
            <li><strong>Blood Pressure:</strong> Between 90/50 and 180/100 mm Hg</li>
            <li><strong>Pulse:</strong> Between 50 and 100 beats per minute</li>
          </ul>
          
          <h4>Temporary Deferrals:</h4>
          <p>You may need to wait to donate if you have:</p>
          <ul>
            <li>Cold, flu, or fever in the last 24 hours</li>
            <li>Certain vaccinations within the past days or weeks</li>
            <li>Antibiotics within 24-48 hours</li>
            <li>Traveled to malaria-endemic regions in the past year</li>
            <li>Tattoos or piercings in the past 3-12 months (varies by region)</li>
            <li>Pregnancy or recent childbirth (6-week waiting period after delivery)</li>
            <li>Recent major surgery (waiting period depends on type of surgery)</li>
          </ul>
          
          <h4>Permanent Deferrals:</h4>
          <p>Some conditions may permanently prevent donation:</p>
          <ul>
            <li>HIV/AIDS</li>
            <li>Chronic heart disease</li>
            <li>History of hepatitis B or C</li>
            <li>Risk factors for Creutzfeldt-Jakob Disease (CJD)</li>
            <li>Cancer (with exceptions for some skin cancers and cancers considered cured)</li>
            <li>Certain chronic illnesses like severe lung, liver, or kidney disease</li>
          </ul>
          
          <p>Remember that eligibility criteria may vary by country and donation center. Always check with your local blood donation organization for the most current requirements.</p>
        `;
      case 'process':
        return `
          <h3>The Blood Donation Process: What to Expect</h3>
          <p>Understanding the blood donation process can help make your experience smooth and stress-free. Here's what typically happens during a donation:</p>
          
          <h4>Before Your Appointment:</h4>
          <ul>
            <li>Eat a healthy meal within 3 hours of donating</li>
            <li>Drink extra water (at least 16 oz) before your appointment</li>
            <li>Get a good night's sleep</li>
            <li>Avoid fatty foods, which can affect blood tests</li>
            <li>Bring ID and list of medications you're taking</li>
          </ul>
          
          <h4>Step 1: Registration (5-10 minutes)</h4>
          <p>You'll complete a registration form and review educational materials. Staff will verify your identity and contact information.</p>
          
          <h4>Step 2: Health History and Mini-Physical (10-15 minutes)</h4>
          <ul>
            <li>Answer confidential questions about health history and travel</li>
            <li>Brief physical examination including temperature, pulse, blood pressure, and hemoglobin test</li>
            <li>Private interview to discuss any health concerns</li>
          </ul>
          
          <h4>Step 3: The Donation (8-10 minutes for whole blood)</h4>
          <ul>
            <li>You'll be seated in a comfortable donation chair</li>
            <li>Your arm will be cleaned with an antiseptic</li>
            <li>A new, sterile needle will be inserted for the blood draw</li>
            <li>You'll squeeze a small object periodically to maintain blood flow</li>
            <li>A whole blood donation takes about 8-10 minutes to collect one pint</li>
            <li>Other donation types (platelets, plasma) may take 1-2 hours</li>
          </ul>
          
          <h4>Step 4: Refreshment and Recovery (10-15 minutes)</h4>
          <ul>
            <li>After donating, you'll rest and enjoy refreshments</li>
            <li>This helps your body begin to replenish fluids</li>
            <li>Staff will provide post-donation care instructions</li>
          </ul>
          
          <h4>After Donating:</h4>
          <ul>
            <li>Drink extra fluids for the next 24-48 hours</li>
            <li>Avoid heavy lifting or strenuous exercise for 24 hours</li>
            <li>Keep the bandage on for several hours</li>
            <li>If you feel dizzy, sit or lie down until you feel better</li>
          </ul>
          
          <h4>Special Donation Types:</h4>
          <p>The process differs slightly for specialized donations:</p>
          <ul>
            <li><strong>Platelet donation:</strong> Takes 1.5-2.5 hours; blood is drawn, platelets are separated, and remaining components are returned to your body</li>
            <li><strong>Plasma donation:</strong> Takes 1-1.5 hours; similar to platelets but plasma is collected instead</li>
            <li><strong>Double red cell donation:</strong> Takes 30 minutes; collects two units of red cells while returning plasma and platelets</li>
          </ul>
        `;
      case 'statistics':
        return `
          <h3>Blood Usage Statistics: Where Your Donation Goes</h3>
          <p>Understanding how donated blood is used highlights the critical importance of regular donations.</p>
          
          <h4>Blood Needs in Numbers:</h4>
          <ul>
            <li>Someone needs blood every 2 seconds</li>
            <li>About 29,000 units of red blood cells are needed daily</li>
            <li>A single car accident victim can require up to 100 units of blood</li>
            <li>One donation can save up to 3 lives</li>
            <li>Only about 3% of age-eligible people donate blood yearly</li>
            <li>Blood has a short shelf life: red cells last 42 days, platelets just 5 days</li>
          </ul>
          
          <h4>What Blood Components Are Used For:</h4>
          <table class="usage-table">
            <thead>
              <tr>
                <th>Blood Component</th>
                <th>Primary Uses</th>
                <th>Percentage of Donations</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Red Blood Cells</td>
                <td>Surgery, trauma, anemia, blood disorders</td>
                <td>~42%</td>
              </tr>
              <tr>
                <td>Platelets</td>
                <td>Cancer treatment, surgery, transplants, bleeding disorders</td>
                <td>~19%</td>
              </tr>
              <tr>
                <td>Plasma</td>
                <td>Burns, trauma, clotting disorders, immune deficiencies</td>
                <td>~24%</td>
              </tr>
              <tr>
                <td>Other Components</td>
                <td>Research, specialized treatments</td>
                <td>~15%</td>
              </tr>
            </tbody>
          </table>
          
          <h4>Blood Usage by Medical Condition:</h4>
          <ul>
            <li><strong>Cancer:</strong> ~25% of blood products</li>
            <li><strong>Heart and organ transplant surgery:</strong> ~15%</li>
            <li><strong>Children with severe anemia:</strong> ~10%</li>
            <li><strong>Trauma victims:</strong> ~15%</li>
            <li><strong>Pregnancy complications:</strong> ~6%</li>
            <li><strong>Blood disorders:</strong> ~12%</li>
            <li><strong>Other medical conditions:</strong> ~17%</li>
          </ul>
          
          <h4>Blood Type Distribution (approximate percentages):</h4>
          <ul>
            <li>O Positive: 38%</li>
            <li>O Negative: 7%</li>
            <li>A Positive: 34%</li>
            <li>A Negative: 6%</li>
            <li>B Positive: 9%</li>
            <li>B Negative: 2%</li>
            <li>AB Positive: 3%</li>
            <li>AB Negative: 1%</li>
          </ul>
          
          <p>These statistics highlight why regular blood donation is crucial - medical needs are constant and blood cannot be manufactured. Your donation directly supports patient care in your community.</p>
        `;
      default:
        return `<p>Detailed information about ${bloodFact.title} will be available soon. Please check back later.</p>`;
    }
  };

  return (
    <>
      <EmergencyAlert />
      <section className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/#blood-facts" className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blood Facts
          </Link>
          
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
            <div className="px-6 py-8 sm:p-10">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center shadow-md">
                  <BloodDropLogo size="md" animated={false} />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900">{bloodFact.title}</h1>
              </div>
              
              <div className="mt-8 prose prose-red max-w-none" dangerouslySetInnerHTML={{ __html: getContentBySlug(slug) }} />
              
              <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between items-center">
                <Link href="/#blood-facts">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back</span>
                  </Button>
                </Link>
                <Link href="/donor-registration">
                  <Button className="flex items-center space-x-2">
                    <span>Become a Donor</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Related Blood Facts */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Blood Facts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bloodFacts
                .filter(fact => fact.id !== bloodFact.id)
                .slice(0, 3)
                .map(fact => (
                  <Link key={fact.id} href={fact.link || '#'}>
                    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all">
                      <h3 className="font-semibold text-gray-900">{fact.title}</h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{fact.content}</p>
                      <div className="mt-4 text-sm text-red-600 hover:text-red-800">Read more →</div>
                    </div>
                  </Link>
                ))
              }
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BloodFactDetail;