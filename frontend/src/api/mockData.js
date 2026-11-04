export const INITIAL_USERS = [
  {
    id: 'user-student',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    studentId: 'STU-98241',
    role: 'student',
    department: 'Computer Science & Design',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'org-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@campus.edu',
    studentId: 'ORG-10294',
    role: 'organizer',
    department: 'Design & Human-Centered Computing Lab',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'org-2',
    name: 'Marcus Vance',
    email: 'm.vance@campus.edu',
    studentId: 'ORG-30219',
    role: 'organizer',
    department: 'Campus AI Society',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_EVENTS = [
  {
    id: 'evt-101',
    title: 'Design Jam: Make & Test',
    tagline: 'Rapid prototyping, wireframing & user testing marathon',
    category: 'Workshop',
    date: '2026-11-04',
    time: '2:00 PM - 5:00 PM',
    location: 'Design Studio 4, Room 201',
    building: 'Creative Arts & Computing Complex',
    organizerId: 'org-1',
    organizerName: 'Sarah Jenkins',
    organizerRole: 'Campus Design Collective',
    capacity: 45,
    description: 'Bring your curiosity and jump straight into hands-on design exercises! This design jam gives you tactics for rapid paper prototyping, low-fidelity wireframing, and peer testing. You will collaborate in small squads to solve a real campus navigation challenge.',
    prerequisites: 'No prior design experience needed. Bring a laptop and your creative enthusiasm.',
    schedule: [
      { time: '2:00 PM', title: 'Check-in & Squad Formation' },
      { time: '2:30 PM', title: 'Problem Brief & Rapid Sketching' },
      { time: '3:45 PM', title: 'Interactive Prototype Sprint' },
      { time: '4:30 PM', title: 'Peer Usability Testing & Showcase' }
    ],
    accentColor: '#F97316',
    isSpotlight: true,
    tags: ['Design', 'Workshop', 'UX/UI', 'Hands-on']
  },
  {
    id: 'evt-102',
    title: 'AI & Autonomous Agents Hackathon',
    tagline: 'Build next-gen autonomous apps with LLMs in 24 hours',
    category: 'Hackathon',
    date: '2026-11-08',
    time: '9:00 AM - 6:00 PM',
    location: 'Turing Hall, CS Center',
    building: 'Engineering Quad Wing B',
    organizerId: 'org-2',
    organizerName: 'Marcus Vance',
    organizerRole: 'Campus AI Society',
    capacity: 100,
    description: 'Join over 100 campus developers to build real-world AI applications using multimodal models, agentic workflows, and cloud backends. Free meals, swag bags, and prizes for Top Innovator and Best Social Impact.',
    prerequisites: 'Familiarity with Python, JavaScript, or general web development.',
    schedule: [
      { time: '9:00 AM', title: 'Breakfast & Team Matchmaking' },
      { time: '10:00 AM', title: 'API Key Handout & Hacking Begins' },
      { time: '1:00 PM', title: 'Lunch & Technical Mentor Office Hours' },
      { time: '5:00 PM', title: 'Demos & Judging Ceremony' }
    ],
    accentColor: '#2563EB',
    isSpotlight: false,
    tags: ['AI', 'Hackathon', 'Coding', 'Prizes']
  },
  {
    id: 'evt-103',
    title: 'Fall Campus Tech Career Fair 2026',
    tagline: 'Connect directly with recruiters from 50+ leading companies',
    category: 'Career',
    date: '2026-11-12',
    time: '10:00 AM - 4:00 PM',
    location: 'Recreation Center, Main Arena',
    building: 'Student Wellness & Sports Hub',
    organizerId: 'org-1',
    organizerName: 'Sarah Jenkins',
    organizerRole: 'Campus Career & Internship Center',
    capacity: 350,
    description: 'Explore full-time positions, summer internships, and research apprenticeships. Connect 1-on-1 with engineering leaders and talent recruiters across software, biotech, finance, and hardware.',
    prerequisites: 'Campus ID card required for entry. Business casual attire recommended.',
    schedule: [
      { time: '10:00 AM', title: 'Doors Open & Priority Entry' },
      { time: '12:00 PM', title: 'Resume Review Breakout Booths' },
      { time: '2:00 PM', title: 'Lightning Talks: Tech Interview Tips' },
      { time: '4:00 PM', title: 'Networking Reception' }
    ],
    accentColor: '#8B5CF6',
    isSpotlight: false,
    tags: ['Career', 'Internships', 'Networking', 'Resume']
  },
  {
    id: 'evt-104',
    title: 'Acoustic Sunset & Campus Food Trucks',
    tagline: 'Live music, artisan food trucks, and lawn relaxation',
    category: 'Social',
    date: '2026-11-15',
    time: '5:30 PM - 9:00 PM',
    location: 'North Quad Amphitheater',
    building: 'Campus Central Greens',
    organizerId: 'org-3',
    organizerName: 'Campus Activities Board',
    organizerRole: 'Student Life Committee',
    capacity: 250,
    description: 'Unwind before midterm season with live acoustic sets from student musicians, complimentary hot apple cider, gourmet taco trucks, and blanket seating on the lawn.',
    prerequisites: 'Open to all students, staff, and faculty.',
    schedule: [
      { time: '5:30 PM', title: 'Food Trucks Open & Lawn Games' },
      { time: '6:15 PM', title: 'Opening Acoustic Set: The Quad Trio' },
      { time: '7:45 PM', title: 'Feature Set & Hot Cider Giveaway' }
    ],
    accentColor: '#10B981',
    isSpotlight: false,
    tags: ['Music', 'Social', 'Food', 'Relax']
  },
  {
    id: 'evt-105',
    title: 'Founder Fireside: Dorm Room to Series A',
    tagline: 'Alumni stories on building scalable products in college',
    category: 'Seminar',
    date: '2026-11-18',
    time: '4:30 PM - 6:00 PM',
    location: 'Auditorium C, Founders Pavilion',
    building: 'Entrepreneurship & Incubation Hall',
    organizerId: 'org-2',
    organizerName: 'Marcus Vance',
    organizerRole: 'Campus Startup Incubator',
    capacity: 70,
    description: 'Hear from two alumni founders who started their venture right here in the dorms and recently closed an $8M funding round. Candid discussion on product validation, co-founders, and raising capital while balancing coursework.',
    prerequisites: 'Open to all majors.',
    schedule: [
      { time: '4:30 PM', title: 'Founder Keynote & Case Study' },
      { time: '5:15 PM', title: 'Open Floor Q&A' },
      { time: '5:45 PM', title: 'Informal Networking & Coffee' }
    ],
    accentColor: '#F59E0B',
    isSpotlight: false,
    tags: ['Startups', 'Venture', 'Alumni', 'Discussion']
  },
  {
    id: 'evt-106',
    title: 'Intramural 3v3 Basketball Tournament',
    tagline: 'Fast-paced campus hoops championship showdown',
    category: 'Sports',
    date: '2026-11-22',
    time: '11:00 AM - 3:00 PM',
    location: 'Pavilion Court 2',
    building: 'Campus Athletics Complex',
    organizerId: 'org-1',
    organizerName: 'Sarah Jenkins',
    organizerRole: 'Recreation & Sports Council',
    capacity: 32,
    description: 'Register as an individual or team of 3-4 players for the fall intramural tournament. Double elimination bracket with championship medals and championship hoodies.',
    prerequisites: 'Athletic wear and non-marking gym shoes required.',
    schedule: [
      { time: '11:00 AM', title: 'Warm-ups & Bracket Seeding' },
      { time: '11:30 AM', title: 'Preliminary Rounds' },
      { time: '2:15 PM', title: 'Championship Finals' }
    ],
    accentColor: '#EF4444',
    isSpotlight: false,
    tags: ['Sports', 'Basketball', 'Tournament', 'Fitness']
  }
];

export const INITIAL_REGISTRATIONS = [
  {
    id: 'reg-001',
    eventId: 'evt-101',
    userId: 'user-student',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@campus.edu',
    studentId: 'STU-98241',
    status: 'CONFIRMED',
    registeredAt: '2026-10-25T14:32:00Z',
    ticketCode: 'CC-98241-101',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CC-98241-101'
  },
  {
    id: 'reg-002',
    eventId: 'evt-101',
    userId: 'user-jane',
    userName: 'Jane Doe',
    userEmail: 'j.doe@campus.edu',
    studentId: 'STU-44102',
    status: 'CONFIRMED',
    registeredAt: '2026-10-26T10:15:00Z',
    ticketCode: 'CC-44102-101',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CC-44102-101'
  },
  {
    id: 'reg-003',
    eventId: 'evt-101',
    userId: 'user-liam',
    userName: 'Liam Cooper',
    userEmail: 'l.cooper@campus.edu',
    studentId: 'STU-88319',
    status: 'CONFIRMED',
    registeredAt: '2026-10-27T09:40:00Z',
    ticketCode: 'CC-88319-101',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CC-88319-101'
  },
  {
    id: 'reg-004',
    eventId: 'evt-103',
    userId: 'user-student',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@campus.edu',
    studentId: 'STU-98241',
    status: 'CONFIRMED',
    registeredAt: '2026-10-24T18:20:00Z',
    ticketCode: 'CC-98241-103',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CC-98241-103'
  }
];
