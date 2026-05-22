const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Medicine = require('./models/Medicine');
const LabTest = require('./models/LabTest');
const Article = require('./models/Article');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  // Clear data
  await Promise.all([User.deleteMany(), Medicine.deleteMany(), LabTest.deleteMany(), Article.deleteMany()]);

  // Create admin
  const admin = await User.create({
    name: 'Admin User', email: 'admin@hospital.com', password: 'admin123', role: 'admin',
  });

  // Create doctors
  const doctors = await User.create([
    { name: 'Dr. Sarah Johnson', email: 'sarah@hospital.com', password: 'doctor123', role: 'doctor', specialization: 'Cardiology', experience: 10, qualification: 'MBBS, MD', consultationFee: 500, bio: 'Expert cardiologist with 10+ years experience', phone: '9876543210' },
    { name: 'Dr. James Wilson', email: 'james@hospital.com', password: 'doctor123', role: 'doctor', specialization: 'Neurology', experience: 8, qualification: 'MBBS, DM Neurology', consultationFee: 600, bio: 'Specialist in neurological disorders', phone: '9876543211' },
    { name: 'Dr. Priya Sharma', email: 'priya@hospital.com', password: 'doctor123', role: 'doctor', specialization: 'Dermatology', experience: 6, qualification: 'MBBS, MD Dermatology', consultationFee: 400, bio: 'Leading dermatologist for skin conditions', phone: '9876543212' },
    { name: 'Dr. Robert Chen', email: 'robert@hospital.com', password: 'doctor123', role: 'doctor', specialization: 'Orthopedics', experience: 12, qualification: 'MBBS, MS Orthopedics', consultationFee: 550, bio: 'Orthopedic surgeon specializing in joint replacement', phone: '9876543213' },
    { name: 'Dr. Anita Patel', email: 'anita@hospital.com', password: 'doctor123', role: 'doctor', specialization: 'Pediatrics', experience: 7, qualification: 'MBBS, MD Pediatrics', consultationFee: 350, bio: "Dedicated to children's health and well-being", phone: '9876543214' },
  ]);

  // Create patient
  await User.create({
    name: 'John Patient', email: 'patient@hospital.com', password: 'patient123', role: 'patient', phone: '9998887777',
  });

  // Create pharmacist
  await User.create({
    name: 'Anita Pharmacy', email: 'pharmacy@hospital.com', password: 'pharmacist123', role: 'pharmacist', phone: '8887776665',
  });

  // Create medicines
  await Medicine.create([
    { name: 'Paracetamol 500mg', description: 'Pain reliever and fever reducer', price: 25, stock: 500, category: 'Pain Relief', manufacturer: 'HealthCorp', dosage: '1 tablet twice daily' },
    { name: 'Amoxicillin 250mg', description: 'Antibiotic for bacterial infections', price: 85, stock: 300, category: 'Antibiotics', manufacturer: 'PharmaCare', dosage: '1 capsule three times daily', requiresPrescription: true },
    { name: 'Omeprazole 20mg', description: 'Reduces stomach acid production', price: 65, stock: 400, category: 'Gastrointestinal', manufacturer: 'MediLife', dosage: '1 capsule daily before meals' },
    { name: 'Metformin 500mg', description: 'Controls blood sugar in type 2 diabetes', price: 45, stock: 600, category: 'Diabetes', manufacturer: 'DiabaCure', dosage: '1 tablet twice daily with meals', requiresPrescription: true },
    { name: 'Atorvastatin 10mg', description: 'Lowers cholesterol levels', price: 120, stock: 250, category: 'Cardiovascular', manufacturer: 'HeartCare', dosage: '1 tablet daily', requiresPrescription: true },
    { name: 'Cetirizine 10mg', description: 'Antihistamine for allergy relief', price: 35, stock: 450, category: 'Allergy', manufacturer: 'AllerFree', dosage: '1 tablet daily' },
    { name: 'Ibuprofen 400mg', description: 'Anti-inflammatory pain relief', price: 40, stock: 380, category: 'Pain Relief', manufacturer: 'HealthCorp', dosage: '1 tablet 3 times daily with food' },
    { name: 'Vitamin D3 1000IU', description: 'Vitamin D supplement for bone health', price: 180, stock: 700, category: 'Supplements', manufacturer: 'VitaPlus', dosage: '1 tablet daily' },
  ]);

  // Create lab tests
  await LabTest.create([
    { name: 'Complete Blood Count (CBC)', description: 'Measures different components of blood', price: 250, duration: '6 hours', category: 'Blood Tests', parameters: ['RBC', 'WBC', 'Hemoglobin', 'Platelets', 'Hematocrit'] },
    { name: 'Lipid Profile', description: 'Measures cholesterol and triglycerides', price: 450, duration: '8 hours', category: 'Blood Tests', parameters: ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides'] },
    { name: 'Blood Sugar (Fasting)', description: 'Fasting glucose test for diabetes screening', price: 120, duration: '4 hours', category: 'Diabetes', parameters: ['Fasting Glucose'] },
    { name: 'Thyroid Profile (T3,T4,TSH)', description: 'Evaluates thyroid gland function', price: 650, duration: '12 hours', category: 'Hormones', parameters: ['T3', 'T4', 'TSH'] },
    { name: 'Liver Function Test (LFT)', description: 'Assesses liver health and function', price: 550, duration: '8 hours', category: 'Organ Function', parameters: ['ALT', 'AST', 'Alkaline Phosphatase', 'Bilirubin', 'Albumin'] },
    { name: 'Kidney Function Test (KFT)', description: 'Evaluates kidney health', price: 480, duration: '8 hours', category: 'Organ Function', parameters: ['Creatinine', 'BUN', 'Uric Acid', 'eGFR'] },
    { name: 'COVID-19 RT-PCR', description: 'Detects active COVID-19 infection', price: 800, duration: '24 hours', category: 'Infectious Disease', parameters: ['SARS-CoV-2 RNA'] },
    { name: 'HbA1c (Glycated Hemoglobin)', description: '3-month average blood sugar level', price: 350, duration: '6 hours', category: 'Diabetes', parameters: ['HbA1c %'] },
  ]);

  // Create articles
  await Article.create([
    {
      title: '10 Tips for a Healthy Heart',
      excerpt: 'Cardiovascular health is crucial for long-term wellness. Learn how to keep your heart in top shape.',
      content: 'Heart disease remains the leading cause of death worldwide. However, many heart conditions are preventable with the right lifestyle choices. Here are 10 evidence-based tips to keep your heart healthy:\n\n1. Exercise regularly - aim for 150 minutes of moderate activity per week\n2. Eat a heart-healthy diet rich in fruits, vegetables, and whole grains\n3. Maintain a healthy weight\n4. Quit smoking and avoid secondhand smoke\n5. Manage stress through meditation and relaxation\n6. Get quality sleep (7-9 hours per night)\n7. Monitor your blood pressure regularly\n8. Control cholesterol levels\n9. Limit alcohol consumption\n10. Stay hydrated throughout the day',
      author: doctors[0]._id,
      category: 'Cardiology',
      tags: ['heart', 'cardiovascular', 'health'],
      isPublished: true,
    },
    {
      title: 'Understanding Diabetes: Prevention and Management',
      excerpt: 'Diabetes affects millions globally. Early detection and lifestyle changes can make a huge difference.',
      content: 'Type 2 diabetes is largely preventable. Understanding the risk factors and taking action early can protect your health. Key strategies include maintaining a healthy weight, staying physically active, eating a balanced diet low in refined sugars, and getting regular blood sugar screenings. If diagnosed, work closely with your healthcare team to manage your condition effectively through medication, diet, and exercise.',
      author: admin._id,
      category: 'Endocrinology',
      tags: ['diabetes', 'blood sugar', 'prevention'],
      isPublished: true,
    },
    {
      title: 'Mental Health Matters: Breaking the Stigma',
      excerpt: 'Mental health is just as important as physical health. Let\'s talk about it openly.',
      content: 'Mental health conditions affect 1 in 4 people worldwide. Despite this prevalence, stigma remains a major barrier to seeking help. Depression, anxiety, and other mental health disorders are real medical conditions that can be effectively treated. Signs to watch for include persistent sadness, changes in sleep or appetite, withdrawal from activities, and difficulty concentrating. If you or someone you know is struggling, reach out to a healthcare professional.',
      author: admin._id,
      category: 'Mental Health',
      tags: ['mental health', 'wellness', 'mindfulness'],
      isPublished: true,
    },
    {
      title: 'The Importance of Regular Health Screenings',
      excerpt: 'Prevention is better than cure. Regular health screenings can detect problems before they become serious.',
      content: 'Regular health check-ups are essential for maintaining good health and catching potential issues early. Key screenings vary by age and gender but typically include blood pressure checks, cholesterol tests, blood sugar tests, cancer screenings, and eye and dental exams. Schedule annual check-ups with your doctor even when you feel healthy.',
      author: doctors[1]._id,
      category: 'Preventive Care',
      tags: ['screenings', 'prevention', 'checkup'],
      isPublished: true,
    },
    {
      title: "Children's Health: Vaccination Schedule Guide",
      excerpt: 'Vaccines protect children from dangerous diseases. Here is a comprehensive guide for parents.',
      content: "Immunization is one of the most effective public health interventions. Following the recommended vaccination schedule protects your child and the community through herd immunity. Key vaccines include BCG at birth, DPT at 6/10/14 weeks, MMR at 9 months, and annual flu vaccines. Always consult your pediatrician for the most current schedule.",
      author: doctors[4]._id,
      category: 'Pediatrics',
      tags: ['vaccination', 'children', 'immunization'],
      isPublished: true,
    },
    {
      title: 'Skin Care in Changing Seasons',
      excerpt: 'Your skin needs different care as seasons change. Here are dermatologist-approved tips.',
      content: 'Seasonal changes can significantly impact your skin health. In winter, cold dry air strips moisture from skin. In summer, UV exposure increases cancer risk. Key tips: moisturize daily, use SPF 30+ sunscreen year-round, stay hydrated, avoid hot showers in winter, and see a dermatologist for any concerning skin changes. A consistent skincare routine adapted to each season is the foundation of healthy skin.',
      author: doctors[2]._id,
      category: 'Dermatology',
      tags: ['skin care', 'dermatology', 'skincare tips'],
      isPublished: true,
    },
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\nLogin credentials:');
  console.log('Admin:   admin@hospital.com / admin123');
  console.log('Doctor:  sarah@hospital.com / doctor123');
  console.log('Patient: patient@hospital.com / patient123');
  mongoose.disconnect();
};

seed().catch(err => { console.error(err); mongoose.disconnect(); });
