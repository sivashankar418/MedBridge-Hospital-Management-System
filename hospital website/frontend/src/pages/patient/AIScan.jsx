import { useState, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Brain, Upload, AlertCircle, CheckCircle, X } from 'lucide-react';

export default function AIScan() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please upload an image file'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setScanning(true);
    // Simulate AI processing with 2.5s delay
    await new Promise(r => setTimeout(r, 2500));
    // Mock: use file size heuristic to simulate result (random-ish)
    const sizeMod = image.size % 10;
    const detected = sizeMod < 5;  // ~50% chance
    setResult({
      detected,
      confidence: detected ? (75 + (image.size % 20)) : (80 + (image.size % 18)),
      areas: detected ? ['Right temporal lobe', 'Approximately 2.3cm diameter'] : [],
      advice: detected
        ? 'Please consult a neurologist immediately. This is a preliminary AI analysis and requires professional medical evaluation.'
        : 'No significant abnormalities detected. Regular checkups are still recommended.',
    });
    setScanning(false);
  };

  const reset = () => { setImage(null); setPreview(null); setResult(null); };

  return (
    <DashboardLayout title="AI MRI Scan Analysis">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={28} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>AI-Powered MRI Analysis</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Upload an MRI scan for preliminary tumor detection analysis using AI</p>
            </div>
          </div>
          <div className="alert alert-warning" style={{ marginTop: 16, marginBottom: 0, background: 'rgba(251,191,36,0.15)', borderColor: 'rgba(251,191,36,0.3)', color: 'rgba(255,255,255,0.9)' }}>
            ⚠️ This is a simulated AI analysis for demonstration purposes only. Always consult a qualified physician for medical diagnosis.
          </div>
        </div>

        {!result ? (
          <div className="card">
            <div className="card-header"><h3 className="card-title">Upload MRI Scan</h3></div>
            <div className="card-body">
              {/* Drop Zone */}
              <div
                style={{ border: `2px dashed ${preview ? 'var(--primary-400)' : 'var(--gray-300)'}`, borderRadius: 16, padding: 40, textAlign: 'center', marginBottom: 20, background: preview ? 'var(--primary-50)' : 'var(--gray-50)', cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => !preview && fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                {preview ? (
                  <div>
                    <img src={preview} alt="MRI Preview" style={{ maxHeight: 300, maxWidth: '100%', borderRadius: 12, marginBottom: 12, objectFit: 'contain' }} />
                    <div style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 8 }}>{image?.name} ({(image?.size / 1024).toFixed(1)} KB)</div>
                    <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); reset(); }}>
                      <X size={14} /> Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ width: 70, height: 70, background: 'var(--gray-200)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Upload size={32} color="var(--gray-400)" />
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 8 }}>Drop MRI image here</h3>
                    <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>or click to browse files (JPG, PNG, DICOM)</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

              <button className="btn btn-primary w-full btn-lg" onClick={handleScan} disabled={!image || scanning}>
                {scanning ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Analyzing with AI... Please wait</span>
                  </>
                ) : (
                  <><Brain size={18} /> Analyze with AI</>
                )}
              </button>

              {scanning && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--gray-600)', marginBottom: 6 }}>
                    <span>Processing MRI...</span><span>Please wait</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '70%', background: 'linear-gradient(90deg, var(--primary-500), var(--teal-500))', animation: 'pulse 1.5s ease infinite' }}></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
                    {['Preprocessing image...', 'Running neural network...', 'Detecting anomalies...'].map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-600)' }}>
                        <div className="loading-spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }}></div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card">
            <div style={{ padding: '24px', background: result.detected ? 'linear-gradient(135deg, #fef2f2, #fee2e2)' : 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '14px 14px 0 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: result.detected ? '#fee2e2' : '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {result.detected ? <AlertCircle size={30} color="#b91c1c" /> : <CheckCircle size={30} color="#15803d" />}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: result.detected ? '#b91c1c' : '#15803d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Analysis Result</div>
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: result.detected ? '#991b1b' : '#14532d', marginTop: 4 }}>
                    {result.detected ? '⚠️ Tumor Detected' : '✅ No Tumor Detected'}
                  </h2>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 4 }}>Confidence Score</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: result.detected ? 'var(--red-500)' : 'var(--green-600)' }}>{result.confidence}%</div>
                  <div className="progress-bar" style={{ marginTop: 8 }}>
                    <div className="progress-fill" style={{ width: `${result.confidence}%`, background: result.detected ? 'var(--red-500)' : 'var(--green-500)' }}></div>
                  </div>
                </div>
                <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 4 }}>Scan Type Detected</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-800)' }}>Brain MRI</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>T1-weighted sequence</div>
                </div>
              </div>

              {result.detected && result.areas.length > 0 && (
                <div style={{ background: '#fef2f2', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#b91c1c', marginBottom: 8 }}>Detected Regions</div>
                  {result.areas.map((a, i) => <div key={i} style={{ fontSize: 14, color: '#991b1b', marginBottom: 4 }}>• {a}</div>)}
                </div>
              )}

              <div className={`alert ${result.detected ? 'alert-danger' : 'alert-success'}`}>
                <AlertCircle size={16} />
                <span>{result.advice}</span>
              </div>

              {preview && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 8 }}>Analyzed Image</div>
                  <img src={preview} alt="Analyzed MRI" style={{ width: '100%', maxHeight: 250, objectFit: 'contain', borderRadius: 12, background: 'var(--gray-100)' }} />
                </div>
              )}

              <button className="btn btn-primary w-full" onClick={reset}>
                <Upload size={16} /> Upload Another Scan
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
