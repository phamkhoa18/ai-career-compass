const http = require('http');

const data = {
  fullName: "Test User",
  className: "12A1",
  familyFinance: "Khá giả (> 40 triệu/năm)",
  academicScores: [
    { subject: "Toán", subjectKey: "toan", score: 8.5 },
    { subject: "Ngữ văn", subjectKey: "nguVan", score: 7.0 }
  ],
  aptitudeSubjects: [
    { subject: "Mỹ thuật", subjectKey: "myThuat", isLiked: true },
    { subject: "Thể dục", subjectKey: "gdtc", isLiked: false }
  ],
  favoriteSubjects: ["Toán"],
  riasecAnswers: new Array(42).fill(1),
  riasecScores: { R: 20, I: 15, A: 10, S: 5, E: 5, C: 5 },
  softSkills: {
    communication: 4, teamwork: 4, problemSolving: 4, leadership: 3, timeManagement: 4, creativity: 5, criticalThinking: 4, adaptability: 4
  },
  interests: ["Công nghệ", "Game"],
  careerValues: { income: 5, stability: 3, creativity: 5, socialImpact: 2, workLifeBalance: 4, advancement: 4 }
};

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/assessment',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

console.log("Sending POST request to /api/assessment...");

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response body:', responseData);
    process.exit(res.statusCode === 200 ? 0 : 1);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  process.exit(1);
});

req.write(JSON.stringify(data));
req.end();
