export interface Patient {
  id: string;
  name: string;
  age: number;
  mrn: string; // Medical Record Number
  condition: string;
  lastVisit: string;
  nextScheduled?: string;
  riskLevel: 'high' | 'medium' | 'low';
  avatar: string;
  reviewed?: boolean; // Mark as reviewed by physician
  reviewedAt?: string;
  reviewedBy?: string;
  ccmRpmEligible?: boolean; // CCM/RPM reimbursement eligibility
  lastCheckIn?: string; // ISO date of most recent patient check-in
}

export interface CheckIn {
  id: string;
  patientId: string;
  timestamp: string;
  responses: { question: string; answer: string }[];
  vitals?: {
    systolic?: number;
    diastolic?: number;
    bloodSugar?: number;
    weight?: number;
    heartRate?: number;
    temperature?: number;
  };
  aiSummary: string;
  flagged: boolean;
  flagReason?: string;
}

export interface DoctorFlag {
  patientId: string;
  priority: 'urgent' | 'review' | 'non-responsive';
  message: string;
  timestamp: string;
  recommendation: string;
}

export interface VitalReading {
  timestamp: string;
  systolic?: number;
  diastolic?: number;
  bloodSugar?: number;
  weight?: number;
  heartRate?: number;
  temperature?: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  logs: MedicationLog[];
}

export interface MedicationLog {
  date: string;
  time: string;
  taken: boolean;
  notes?: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface AIConversation {
  id: string;
  patientId: string;
  timestamp: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
  summary: string;
}

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Margaret Chen',
    age: 67,
    mrn: 'MRN-284719',
    condition: 'Hypertension - New Medication',
    lastVisit: '2026-03-12',
    riskLevel: 'high',
    avatar: 'MC',
    ccmRpmEligible: true,
    lastCheckIn: '2026-04-09'
  },
  {
    id: 'p2',
    name: 'James Rodriguez',
    age: 54,
    mrn: 'MRN-192847',
    condition: 'Type 2 Diabetes',
    lastVisit: '2026-01-15',
    nextScheduled: '2026-04-15',
    riskLevel: 'medium',
    avatar: 'JR',
    ccmRpmEligible: true,
    lastCheckIn: '2026-04-09'
  },
  {
    id: 'p3',
    name: 'Sarah Williams',
    age: 42,
    mrn: 'MRN-847293',
    condition: 'Post-op Knee Arthroscopy',
    lastVisit: '2026-03-28',
    riskLevel: 'low',
    avatar: 'SW',
    ccmRpmEligible: false,
    lastCheckIn: '2026-04-09'
  },
  {
    id: 'p4',
    name: 'David Park',
    age: 71,
    mrn: 'MRN-564829',
    condition: 'Cholesterol Management',
    lastVisit: '2026-02-20',
    nextScheduled: '2026-05-20',
    riskLevel: 'low',
    avatar: 'DP',
    ccmRpmEligible: true,
    lastCheckIn: '2026-04-02' // 7 days silent
  },
  {
    id: 'p5',
    name: 'Linda Thompson',
    age: 59,
    mrn: 'MRN-738291',
    condition: 'Hypertension - Stable',
    lastVisit: '2026-01-08',
    nextScheduled: '2026-06-08',
    riskLevel: 'low',
    avatar: 'LT',
    ccmRpmEligible: true,
    lastCheckIn: '2026-04-06' // 3 days silent — non-responsive threshold
  }
];

export const mockVitals: Record<string, VitalReading[]> = {
  p1: [
    { timestamp: '2026-02-20', systolic: 155, diastolic: 96, heartRate: 82 },
    { timestamp: '2026-02-27', systolic: 152, diastolic: 94, heartRate: 80 },
    { timestamp: '2026-03-06', systolic: 149, diastolic: 92, heartRate: 79 },
    { timestamp: '2026-03-13', systolic: 142, diastolic: 88, heartRate: 78 },
    { timestamp: '2026-03-20', systolic: 138, diastolic: 86, heartRate: 76 },
    { timestamp: '2026-03-27', systolic: 145, diastolic: 90, heartRate: 82 },
    { timestamp: '2026-04-03', systolic: 148, diastolic: 92, heartRate: 84 },
    { timestamp: '2026-04-09', systolic: 151, diastolic: 94, heartRate: 86 },
    { timestamp: '2026-04-14', systolic: 153, diastolic: 95, heartRate: 87 }
  ],
  p2: [
    { timestamp: '2026-02-22', bloodSugar: 158, weight: 202 },
    { timestamp: '2026-03-01', bloodSugar: 152, weight: 201 },
    { timestamp: '2026-03-08', bloodSugar: 148, weight: 200 },
    { timestamp: '2026-03-15', bloodSugar: 142, weight: 198 },
    { timestamp: '2026-03-22', bloodSugar: 138, weight: 197 },
    { timestamp: '2026-03-29', bloodSugar: 135, weight: 196 },
    { timestamp: '2026-04-05', bloodSugar: 132, weight: 195 },
    { timestamp: '2026-04-09', bloodSugar: 128, weight: 194 },
    { timestamp: '2026-04-14', bloodSugar: 125, weight: 193 }
  ],
  p3: [
    { timestamp: '2026-03-29', temperature: 98.6, heartRate: 72 },
    { timestamp: '2026-04-01', temperature: 98.4, heartRate: 70 },
    { timestamp: '2026-04-05', temperature: 98.5, heartRate: 68 },
    { timestamp: '2026-04-09', temperature: 98.6, heartRate: 69 },
    { timestamp: '2026-04-14', temperature: 98.5, heartRate: 67 }
  ],
  current: [ // For logged-in patient (Margaret Chen / p1 perspective)
    { timestamp: '2026-02-20', systolic: 155, diastolic: 96, heartRate: 82 },
    { timestamp: '2026-02-27', systolic: 152, diastolic: 94, heartRate: 80 },
    { timestamp: '2026-03-06', systolic: 149, diastolic: 92, heartRate: 79 },
    { timestamp: '2026-03-13', systolic: 142, diastolic: 88, heartRate: 78 },
    { timestamp: '2026-03-20', systolic: 138, diastolic: 86, heartRate: 76 },
    { timestamp: '2026-03-27', systolic: 145, diastolic: 90, heartRate: 82 },
    { timestamp: '2026-04-03', systolic: 148, diastolic: 92, heartRate: 84 },
    { timestamp: '2026-04-09', systolic: 151, diastolic: 94, heartRate: 86 },
    { timestamp: '2026-04-14', systolic: 153, diastolic: 95, heartRate: 87 }
  ]
};

export const mockCheckIns: CheckIn[] = [
  {
    id: 'c1',
    patientId: 'p1',
    timestamp: '2026-04-09T08:30:00',
    responses: [
      { question: 'Have you been taking your medication as prescribed?', answer: 'Yes, every morning' },
      { question: 'Any dizziness or lightheadedness?', answer: 'Some dizziness when standing up quickly' },
      { question: 'Any chest pain or shortness of breath?', answer: 'No' },
      { question: 'Any new side effects?', answer: 'Slight headaches in the afternoon' }
    ],
    vitals: { systolic: 151, diastolic: 94, heartRate: 86 },
    aiSummary: 'Patient compliant with medication but BP trending upward (151/94). Reports orthostatic dizziness and new headaches. Medication may need adjustment.',
    flagged: true,
    flagReason: 'Blood pressure increasing despite medication adherence'
  },
  {
    id: 'c2',
    patientId: 'p2',
    timestamp: '2026-04-09T09:15:00',
    responses: [
      { question: 'Have you checked your blood sugar this week?', answer: 'Yes, twice daily' },
      { question: 'What have your readings been?', answer: 'Mostly between 120-135' },
      { question: 'Following your meal plan?', answer: 'Yes, and lost 4 pounds this month' },
      { question: 'Any numbness or tingling?', answer: 'No' }
    ],
    vitals: { bloodSugar: 128, weight: 194 },
    aiSummary: 'Excellent adherence. Blood sugar well controlled (128 mg/dL). Patient has lost 4 lbs this month. No concerning symptoms.',
    flagged: false
  },
  {
    id: 'c3',
    patientId: 'p3',
    timestamp: '2026-04-09T10:00:00',
    responses: [
      { question: 'How is your pain level (0-10)?', answer: '2-3, much better' },
      { question: 'Are you doing your physical therapy exercises?', answer: 'Yes, twice a day' },
      { question: 'Any swelling, redness, or warmth?', answer: 'No' },
      { question: 'Can you walk without assistance?', answer: 'Yes, no crutches needed anymore' }
    ],
    vitals: { temperature: 98.6, heartRate: 69 },
    aiSummary: 'Recovery progressing well. Pain minimal (2-3/10), good PT adherence, full weight bearing. No signs of infection. No intervention needed.',
    flagged: false
  }
];

export const mockFlags: DoctorFlag[] = [
  {
    patientId: 'p1',
    priority: 'urgent',
    message: 'Blood pressure trending upward despite medication compliance',
    timestamp: '2026-04-09T08:30:00',
    recommendation: 'Consider: (1) Increase lisinopril to 20mg, (2) Order metabolic panel to check kidney function, (3) Schedule telehealth to discuss symptoms'
  },
  {
    patientId: 'p2',
    priority: 'review',
    message: 'Patient had AI conversation about diet concerns and requested doctor review',
    timestamp: '2026-04-09T09:20:00',
    recommendation: 'AI Conversation Summary: Patient expressed concerns about managing carb intake while dining out. Asked about portion control strategies and whether current meal plan allows flexibility for social situations. Appears motivated but anxious about maintaining progress. Consider sending encouragement message or brief telehealth check-in to address concerns.'
  },
  {
    patientId: 'p5',
    priority: 'non-responsive',
    message: 'Silent for 3 days — no check-in since Apr 6',
    timestamp: '2026-04-09T06:00:00',
    recommendation: 'Patient has not completed scheduled check-ins. Silence in a hypertensive patient is a clinical signal worth escalating. Suggest: (1) automated outreach text, (2) nurse call if no response by EOD, (3) flag for in-person welfare check if 5+ days elapse.'
  },
  {
    patientId: 'p4',
    priority: 'non-responsive',
    message: 'Silent for 7 days — no check-in since Apr 2',
    timestamp: '2026-04-08T10:00:00',
    recommendation: 'Extended silence exceeds the 5-day concern threshold. Suggest: (1) direct phone outreach today, (2) confirm device/app is functioning, (3) review social factors that may be interfering with engagement.'
  }
];

export const mockMedications: Record<string, Medication[]> = {
  current: [ // For current logged-in patient
    {
      id: 'm1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily (morning)',
      startDate: '2026-03-12',
      logs: [
        { date: '2026-04-14', time: '08:00', taken: true },
        { date: '2026-04-13', time: '08:15', taken: true },
        { date: '2026-04-12', time: '08:30', taken: true },
        { date: '2026-04-11', time: '09:00', taken: true, notes: 'Took a bit late' },
        { date: '2026-04-10', time: '08:00', taken: true },
        { date: '2026-04-09', time: '08:00', taken: true },
        { date: '2026-04-08', time: '08:00', taken: true }
      ]
    },
    {
      id: 'm2',
      name: 'Aspirin',
      dosage: '81mg',
      frequency: 'Once daily (morning)',
      startDate: '2026-03-12',
      logs: [
        { date: '2026-04-14', time: '08:00', taken: true },
        { date: '2026-04-13', time: '08:15', taken: true },
        { date: '2026-04-12', time: '08:30', taken: true },
        { date: '2026-04-11', time: '09:00', taken: true },
        { date: '2026-04-10', time: '08:00', taken: true },
        { date: '2026-04-09', time: '08:00', taken: true },
        { date: '2026-04-08', time: '08:00', taken: true }
      ]
    }
  ]
};

export const mockClinicalNotes: ClinicalNote[] = [
  {
    id: 'n1',
    patientId: 'p1',
    text: 'Patient reports dizziness - may need med adjustment',
    author: 'Dr. Sarah Mitchell',
    timestamp: '2026-04-09T10:30:00'
  },
  {
    id: 'n2',
    patientId: 'p1',
    text: 'BP trending up despite compliance - consider increasing dose',
    author: 'Dr. Sarah Mitchell',
    timestamp: '2026-04-10T09:15:00'
  }
];

export const mockAIConversations: AIConversation[] = [
  {
    id: 'ai1',
    patientId: 'current',
    timestamp: '2026-04-09T14:30:00',
    messages: [
      {
        role: 'user',
        content: 'I forgot to take my blood pressure this morning. Should I take it now or wait until tomorrow?',
        timestamp: '2026-04-09T14:30:00'
      },
      {
        role: 'assistant',
        content: 'It\'s completely fine to take your blood pressure now! Here\'s what I recommend:\n\n1. Rest for 5 minutes before taking it\n2. Sit with your back supported and feet flat\n3. Take it as you normally would\n\nThere\'s no need to wait until tomorrow. The timing might be different than usual, but it\'s still valuable data. Would you like me to remind you tomorrow morning at your usual time?',
        timestamp: '2026-04-09T14:31:00'
      },
      {
        role: 'user',
        content: 'Yes please! Can you remind me at 8am?',
        timestamp: '2026-04-09T14:32:00'
      },
      {
        role: 'assistant',
        content: 'Perfect! I\'ve set a reminder for 8:00 AM tomorrow to take your blood pressure. You\'ll get a notification on your phone. Is there anything else I can help you with today?',
        timestamp: '2026-04-09T14:32:30'
      }
    ],
    summary: 'Patient asked about timing for missed BP reading. Provided guidance and set up 8 AM daily reminder.'
  },
  {
    id: 'ai2',
    patientId: 'current',
    timestamp: '2026-04-07T11:15:00',
    messages: [
      {
        role: 'user',
        content: 'I\'ve been getting headaches in the afternoon. Is this related to my blood pressure medication?',
        timestamp: '2026-04-07T11:15:00'
      },
      {
        role: 'assistant',
        content: 'Headaches can sometimes be a side effect of blood pressure medications like Lisinopril, especially when you first start taking them. A few questions:\n\n1. When did the headaches start?\n2. How would you rate the pain (1-10)?\n3. Do they get better with over-the-counter pain relief?\n\nI\'ll flag this for Dr. Mitchell to review, as she may want to adjust your medication or rule out other causes.',
        timestamp: '2026-04-07T11:16:00'
      },
      {
        role: 'user',
        content: 'They started about a week ago. Maybe a 4-5 out of 10. I took Tylenol and it helped.',
        timestamp: '2026-04-07T11:17:00'
      },
      {
        role: 'assistant',
        content: 'Thank you for that information. Since this is a new symptom that started after beginning your medication, I\'ve created a note for Dr. Mitchell to review. In the meantime:\n\n- Continue taking your medication as prescribed\n- Keep track of when headaches occur\n- Stay well hydrated\n- Tylenol is fine to use as needed\n\nDr. Mitchell will likely reach out within 24 hours. If the headaches get worse or you develop other symptoms, please call the office right away.',
        timestamp: '2026-04-07T11:18:00'
      }
    ],
    summary: 'Patient reporting new headaches (4-5/10 severity) starting 1 week after medication initiation. Responds to Tylenol. Flagged for physician review - may require medication adjustment.'
  },
  {
    id: 'ai3',
    patientId: 'current',
    timestamp: '2026-04-05T16:45:00',
    messages: [
      {
        role: 'user',
        content: 'What foods should I avoid with high blood pressure?',
        timestamp: '2026-04-05T16:45:00'
      },
      {
        role: 'assistant',
        content: 'Great question! Managing your diet is really important for blood pressure control. Here are the main things to limit:\n\n**Reduce:**\n- Sodium (aim for less than 2,300mg/day)\n- Processed foods (deli meats, canned soups, frozen meals)\n- Fast food and restaurant meals\n- Salty snacks (chips, pretzels)\n- Alcohol (limit to 1 drink/day for women, 2 for men)\n\n**Focus on:**\n- Fresh fruits and vegetables\n- Whole grains\n- Lean proteins\n- Low-fat dairy\n- Foods rich in potassium (bananas, sweet potatoes, spinach)\n\nThe DASH diet is specifically designed for blood pressure control. Would you like me to share some resources about it?',
        timestamp: '2026-04-05T16:46:00'
      },
      {
        role: 'user',
        content: 'That would be helpful, thanks!',
        timestamp: '2026-04-05T16:47:00'
      }
    ],
    summary: 'Patient asking about dietary modifications for hypertension. Provided DASH diet guidance and offered educational resources.'
  }
];

export interface Physician {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  totalPatients: number;
  activePatients: number;
  availableSlots: number; // Available due to system efficiencies
  weeklyCheckIns: number;
  appointmentsSaved: number; // Appointments skipped due to AI monitoring
  timeSavedHours: number;
}

export interface WaitingPatient {
  id: string;
  name: string;
  age: number;
  condition: string;
  priority: 'urgent' | 'routine';
  waitingSince: string;
  preferredPhysician?: string;
  insurance: string;
  contactInfo: string;
}

export interface PatientAssignment {
  id: string;
  patientId: string;
  patientName: string;
  physicianId: string;
  assignedDate: string;
  assignedBy: string;
  isNew: boolean; // For notification purposes
}

export const mockPhysicians: Physician[] = [
  {
    id: 'doc1',
    name: 'Dr. Sarah Mitchell',
    specialty: 'Primary Care',
    avatar: 'SM',
    totalPatients: 5,
    activePatients: 5,
    availableSlots: 8, // Can take 8 more patients due to efficiencies
    weeklyCheckIns: 12,
    appointmentsSaved: 3,
    timeSavedHours: 4.5
  },
  {
    id: 'doc2',
    name: 'Dr. Michael Chen',
    specialty: 'Internal Medicine',
    avatar: 'MC',
    totalPatients: 7,
    activePatients: 7,
    availableSlots: 5,
    weeklyCheckIns: 18,
    appointmentsSaved: 4,
    timeSavedHours: 6.0
  },
  {
    id: 'doc3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Family Medicine',
    avatar: 'ER',
    totalPatients: 4,
    activePatients: 4,
    availableSlots: 10,
    weeklyCheckIns: 9,
    appointmentsSaved: 2,
    timeSavedHours: 3.0
  },
  {
    id: 'doc4',
    name: 'Dr. James Williams',
    specialty: 'Primary Care',
    avatar: 'JW',
    totalPatients: 6,
    activePatients: 6,
    availableSlots: 6,
    weeklyCheckIns: 15,
    appointmentsSaved: 5,
    timeSavedHours: 7.5
  }
];

export const mockWaitingPatients: WaitingPatient[] = [
  {
    id: 'w1',
    name: 'Robert Anderson',
    age: 58,
    condition: 'Hypertension - New Diagnosis',
    priority: 'urgent',
    waitingSince: '2026-04-07',
    insurance: 'Blue Cross',
    contactInfo: '(555) 234-5678'
  },
  {
    id: 'w2',
    name: 'Patricia Lewis',
    age: 45,
    condition: 'Type 2 Diabetes - Follow-up',
    priority: 'routine',
    waitingSince: '2026-04-05',
    preferredPhysician: 'Dr. Sarah Mitchell',
    insurance: 'Aetna',
    contactInfo: '(555) 345-6789'
  },
  {
    id: 'w3',
    name: 'Michael Brown',
    age: 62,
    condition: 'Cholesterol Management',
    priority: 'routine',
    waitingSince: '2026-04-08',
    insurance: 'UnitedHealth',
    contactInfo: '(555) 456-7890'
  },
  {
    id: 'w4',
    name: 'Jennifer Martinez',
    age: 51,
    condition: 'Post-Cardiac Event Monitoring',
    priority: 'urgent',
    waitingSince: '2026-04-09',
    insurance: 'Medicare',
    contactInfo: '(555) 567-8901'
  },
  {
    id: 'w5',
    name: 'Thomas Garcia',
    age: 39,
    condition: 'Asthma Management',
    priority: 'routine',
    waitingSince: '2026-04-06',
    insurance: 'Cigna',
    contactInfo: '(555) 678-9012'
  }
];

export const mockPatientAssignments: PatientAssignment[] = [
  {
    id: 'a1',
    patientId: 'p5',
    patientName: 'Linda Thompson',
    physicianId: 'doc1',
    assignedDate: '2026-04-09T07:30:00',
    assignedBy: 'Admin - Jennifer Kim',
    isNew: true
  }
];

export interface SystemConfig {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  category: 'alerts' | 'monitoring' | 'engagement';
}

export const mockSystemConfig: SystemConfig[] = [
  {
    id: 'bp-urgent-systolic',
    name: 'Blood Pressure - Urgent (Systolic)',
    description: 'Flag as urgent when systolic BP exceeds this threshold',
    value: 150,
    unit: 'mmHg',
    category: 'alerts'
  },
  {
    id: 'bp-urgent-diastolic',
    name: 'Blood Pressure - Urgent (Diastolic)',
    description: 'Flag as urgent when diastolic BP exceeds this threshold',
    value: 95,
    unit: 'mmHg',
    category: 'alerts'
  },
  {
    id: 'bp-trending-increase',
    name: 'Blood Pressure - Trending Concern',
    description: 'Flag when BP increases by this amount over 2 weeks',
    value: 10,
    unit: 'mmHg',
    category: 'alerts'
  },
  {
    id: 'blood-sugar-urgent',
    name: 'Blood Sugar - Urgent',
    description: 'Flag as urgent when blood sugar exceeds this threshold',
    value: 200,
    unit: 'mg/dL',
    category: 'alerts'
  },
  {
    id: 'missed-checkins',
    name: 'Missed Check-ins Threshold',
    description: 'Flag patient after missing this many consecutive check-ins',
    value: 2,
    unit: 'check-ins',
    category: 'engagement'
  },
  {
    id: 'checkin-frequency',
    name: 'Check-in Frequency',
    description: 'How often patients should complete check-ins',
    value: 7,
    unit: 'days',
    category: 'monitoring'
  }
];