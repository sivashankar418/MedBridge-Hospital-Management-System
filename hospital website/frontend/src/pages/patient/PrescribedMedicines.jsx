import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { appointmentAPI } from '../../api';
import toast from 'react-hot-toast';
import { Package, Globe } from 'lucide-react';

const statusColors = {
  pending: 'badge-warning',
  approved: 'badge-info',
  ready_for_delivery: 'badge-primary',
  delivered: 'badge-success',
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'te', name: 'Telugu' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'kn', name: 'Kannada' },
];

const translateText = async (text, targetLang) => {
  if (targetLang === 'en') return text; // No translation needed for English
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    const data = await response.json();
    return data.responseData?.translatedText || text;
  } catch (err) {
    console.error('Translation error:', err);
    return text; // Return original text if translation fails
  }
};

export default function PrescribedMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translations, setTranslations] = useState({}); // Cache for translations
  const [translating, setTranslating] = useState(false);

  const fetchPrescribedMedicines = async () => {
    setLoading(true);
    try {
      const { data } = await appointmentAPI.getMy({ limit: 100 });
      // Group prescriptions by appointment
      const prescriptions = data.appointments?.filter(apt => apt.prescriptionSubmitted && apt.prescriptionItems?.length > 0) || [];
      setMedicines(prescriptions);
    } catch (err) {
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescribedMedicines();
  }, []);

  const handleLanguageChange = async (lang) => {
    setSelectedLanguage(lang);
    
    if (lang === 'en') {
      setTranslations({}); // Clear translations for English
      return;
    }

    setTranslating(true);
    try {
      const newTranslations = { ...translations };
      
      // Translate all medicine names
      for (const apt of medicines) {
        for (const med of apt.prescriptionItems || []) {
          const cacheKey = `${med.medicine}_${lang}`;
          if (!newTranslations[cacheKey]) {
            const translated = await translateText(med.medicine, lang);
            newTranslations[cacheKey] = translated;
          }
        }
      }
      
      setTranslations(newTranslations);
    } catch (err) {
      toast.error('Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  const getTranslatedName = (medicineName) => {
    if (selectedLanguage === 'en') return medicineName;
    const cacheKey = `${medicineName}_${selectedLanguage}`;
    return translations[cacheKey] || medicineName;
  };

  return (
    <DashboardLayout title="Prescribed Medicines">
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">My Prescribed Medicines</h3>
            <p style={{ marginTop: 4, color: 'var(--gray-500)' }}>View all medicines prescribed by doctors.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={18} style={{ color: 'var(--primary)' }} />
              <select 
                className="form-control"
                style={{ width: 150 }}
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                disabled={translating}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            {translating && <div className="loading-spinner" style={{ width: 20, height: 20 }}></div>}
          </div>
        </div>

        {loading ? (
          <div className="loading-overlay"><div className="loading-spinner"></div></div>
        ) : medicines.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Package size={36} /></div>
            <h3>No prescribed medicines</h3>
            <p>You haven't received any prescriptions yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Medicines</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((apt, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{apt.doctor?.name}</td>
                    <td>{new Date(apt.date).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'grid', gap: 8 }}>
                        {apt.prescriptionItems?.map((med, midx) => (
                          <div key={midx} style={{ borderBottom: midx < apt.prescriptionItems.length - 1 ? '1px solid var(--gray-100)' : 'none', paddingBottom: midx < apt.prescriptionItems.length - 1 ? 8 : 0 }}>
                            <div style={{ fontWeight: 500 }}>
                              {med.medicine}
                              {selectedLanguage !== 'en' && getTranslatedName(med.medicine) !== med.medicine && (
                                <span style={{ marginLeft: 8, color: 'var(--primary)', fontSize: 13 }}>
                                  ({getTranslatedName(med.medicine)})
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--gray-600)' }}>
                              {med.dosage && <span>{med.dosage}</span>}
                              {med.quantity && <span> • Qty: {med.quantity}</span>}
                              {med.instruction && <span> • {med.instruction}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${statusColors[apt.prescriptionStatus] || 'badge-gray'}`}>
                        {apt.prescriptionStatus === 'ready_for_delivery' ? 'Ready for Delivery' : apt.prescriptionStatus || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
