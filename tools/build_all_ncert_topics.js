// tools/build_all_ncert_topics.js
// Authoritative curriculum builder for all 106 rationalised NCERT chapters
const fs = require('fs');
const path = require('path');

const { ALL_NCERT_CHAPTERS } = require('../apps/web/src/lib/curriculum/fixtures/ncert-chapters-data.ts');

console.log(`Loaded ${ALL_NCERT_CHAPTERS.length} chapters.`);
