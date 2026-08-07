import { readFileSync } from 'fs';

const mbti = readFileSync('./src/utils/mbti.ts', 'utf-8');
console.log(mbti.substring(0, 100));
