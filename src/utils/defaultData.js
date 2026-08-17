export const defaultCategories = [
  { 
    id: 'inspiring', 
    title: '🏆 Most Inspiring Mentor', 
    shortTitle: 'Inspiring Mentor',
    desc: 'Faculty who motivates, guides, and leads students to achieve their best.' 
  },
  { 
    id: 'explainer', 
    title: '💡 Best Concept Explainer', 
    shortTitle: 'Concept Master',
    desc: 'Faculty who makes even the toughest CSE algorithms & subjects simple and engaging.' 
  },
  { 
    id: 'friendly', 
    title: '😊 Most Friendly & Approachable', 
    shortTitle: 'Most Approachable',
    desc: 'Faculty who is always patient, supportive, and accessible to every student.' 
  },
  { 
    id: 'techGuru', 
    title: '💻 Tech Guru & Coding Wizard', 
    shortTitle: 'Tech Guru',
    desc: 'Faculty with exceptional practical coding knowledge and innovative lab mentorship.' 
  },
  { 
    id: 'starFaculty', 
    title: '🌟 All-Rounder Star Faculty', 
    shortTitle: 'All-Rounder Star',
    desc: 'Outstanding all-round dedication, passion for teaching, and student admiration.' 
  }
];

export const defaultTeachers = [
  {
    id: "50170",
    name: "Dr. A.V. Ramana",
    degree: "M.Tech., Ph.D.",
    department: "Computer Science & Engineering",
    designation: "Professor & DEAN SAC",
    avatar: "/faculty/Dr_A_V_Ramana.jpg",
    categoryVotes: { inspiring: 14, explainer: 12, friendly: 18, techGuru: 9, starFaculty: 22 },
    totalVotes: 75,
    votes: 75
  },
  {
    id: "87018",
    name: "Dr. Deevi Radha Rani",
    degree: "M.Tech., Ph.D.",
    department: "Computer Science & Engineering",
    designation: "Professor",
    avatar: "/faculty/Dr_Deevi_Radha_Rani.jpg",
    categoryVotes: { inspiring: 16, explainer: 19, friendly: 11, techGuru: 14, starFaculty: 20 },
    totalVotes: 80,
    votes: 80
  },
  {
    id: "50390",
    name: "Dr. K. Lakshmana Rao",
    degree: "M.Tech., Ph.D.",
    department: "Computer Science & Engineering",
    designation: "Professor & HOD-CSE",
    avatar: "/faculty/Dr_K_Lakshmana_Rao.jpg",
    categoryVotes: { inspiring: 20, explainer: 15, friendly: 14, techGuru: 12, starFaculty: 24 },
    totalVotes: 85,
    votes: 85
  },
  {
    id: "51709",
    name: "Dr. R. Cristin",
    degree: "M.Tech., Ph.D.",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    avatar: "/faculty/Dr_R_Cristin.jpg",
    categoryVotes: { inspiring: 11, explainer: 14, friendly: 19, techGuru: 17, starFaculty: 16 },
    totalVotes: 77,
    votes: 77
  },
  {
    id: "52122",
    name: "Dr. S. Akila Agnes",
    degree: "M.Tech., Ph.D.",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    avatar: "/faculty/Dr_S_Akila_Agnes.jpg",
    categoryVotes: { inspiring: 10, explainer: 18, friendly: 15, techGuru: 13, starFaculty: 17 },
    totalVotes: 73,
    votes: 73
  },
  {
    id: "52307",
    name: "Dr. K. Kavitha",
    degree: "M.Tech., Ph.D.",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    avatar: "/faculty/Dr_K_Kavitha.jpg",
    categoryVotes: { inspiring: 9, explainer: 16, friendly: 14, techGuru: 11, starFaculty: 15 },
    totalVotes: 65,
    votes: 65
  },
  {
    id: "52270",
    name: "Dr. D. Sowjanya",
    degree: "M.Tech., Ph.D.",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    avatar: "/faculty/Dr_D_Sowjanya.jpg",
    categoryVotes: { inspiring: 8, explainer: 14, friendly: 20, techGuru: 10, starFaculty: 14 },
    totalVotes: 66,
    votes: 66
  },
  {
    id: "52317",
    name: "Dr. T. Daniya",
    degree: "M.Tech., Ph.D.",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    avatar: "/faculty/Dr_T_Daniya.jpg",
    categoryVotes: { inspiring: 7, explainer: 15, friendly: 16, techGuru: 12, starFaculty: 13 },
    totalVotes: 63,
    votes: 63
  },
  {
    id: "50810",
    name: "Sri M. Satish",
    degree: "M.Tech.",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    avatar: "/faculty/Sri_M_Satish.jpg",
    categoryVotes: { inspiring: 13, explainer: 17, friendly: 21, techGuru: 19, starFaculty: 22 },
    totalVotes: 92,
    votes: 92
  },
  {
    id: "51594",
    name: "Sri A. V. Ramana",
    degree: "M.Tech.",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    avatar: "/faculty/Sri_A_V_Ramana.jpg",
    categoryVotes: { inspiring: 12, explainer: 14, friendly: 18, techGuru: 15, starFaculty: 17 },
    totalVotes: 76,
    votes: 76
  },
  {
    id: "51649",
    name: "Sri V. Srinadh",
    degree: "M.Tech.",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    avatar: "/faculty/Sri_V_Srinadh.jpg",
    categoryVotes: { inspiring: 15, explainer: 16, friendly: 22, techGuru: 18, starFaculty: 21 },
    totalVotes: 92,
    votes: 92
  },
  {
    id: "51838",
    name: "Sri J. Vasudeva Rao",
    degree: "M.Tech.",
    department: "Computer Science & Engineering",
    designation: "Assistant Professor",
    avatar: "/faculty/Sri_J_Vasudeva_Rao.jpg",
    categoryVotes: { inspiring: 11, explainer: 15, friendly: 19, techGuru: 16, starFaculty: 18 },
    totalVotes: 79,
    votes: 79
  }
];

export const defaultAnecdotes = [
  {
    id: 'a-1',
    studentName: 'Anonymous CSE Student',
    department: 'CSE',
    year: '3rd Year',
    section: 'CSE 3A',
    teacherName: 'Dr. K. Lakshmana Rao',
    anecdote: 'Whenever our class gets noisy, Sir just smiles and says "Okay developers, commit your silence or face merge conflicts!" Instant laughter and everyone gets back to coding.',
    status: 'approved',
    reactions: { funny: 28, heart: 42, clap: 35 },
    createdAt: '2026-08-16T10:30:00.000Z'
  },
  {
    id: 'a-2',
    studentName: 'Anonymous CSE Student',
    department: 'CSE',
    year: '2nd Year',
    section: 'CSE 2B',
    teacherName: 'Sri M. Satish',
    anecdote: 'During our Data Structures lab, Satish Sir helped debug a pointer segmentation fault at 5:30 PM until everyone in our batch got green tests. Best lab mentor ever!',
    status: 'approved',
    reactions: { funny: 12, heart: 55, clap: 48 },
    createdAt: '2026-08-16T11:45:00.000Z'
  },
  {
    id: 'a-3',
    studentName: 'Anonymous CSE Student',
    department: 'CSE',
    year: '3rd Year',
    section: 'CSE 3C',
    teacherName: 'Dr. Deevi Radha Rani',
    anecdote: 'Radha Rani Ma\'am explains Big-O notation using college canteen queue analogies. Nobody in our section has ever forgotten time complexity after that lecture!',
    status: 'approved',
    reactions: { funny: 38, heart: 46, clap: 39 },
    createdAt: '2026-08-16T14:10:00.000Z'
  }
];

export const defaultShowcase = {
  totalParticipants: 184,
  fundsCollected: 9200,
  recentDonations: [],
  celebrationStatus: 'active'
};
