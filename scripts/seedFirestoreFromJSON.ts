/**
 * Firestore Seed Script (from JSON)
 *
 * Seeds Firestore with content from FIRESTORE_CONTENT_COMPLETE.json
 *
 * Run: npx tsx scripts/seedFirestoreFromJSON.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedFirestore() {
  console.log('🌱 Starting Firestore seed from JSON...\n');

  try {
    // Load JSON file
    const jsonPath = path.join(__dirname, '..', 'FIRESTORE_CONTENT_COMPLETE.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(jsonContent);

    // Step 1: Create metadata document
    console.log('📄 Creating metadata document...');
    await setDoc(doc(db, 'metadata', 'content'), {
      ...data.metadata.content,
      lastUpdated: serverTimestamp(),
    });
    console.log('✅ Metadata created (version: 1)\n');

    // Step 2: Seed Parami documents
    console.log('📚 Seeding Paramis...');
    for (const [id, parami] of Object.entries(data.paramis)) {
      await setDoc(doc(db, 'paramis', id), {
        ...parami,
        updatedAt: serverTimestamp(),
      });
      console.log(`  ✓ ${(parami as any).id}. ${(parami as any).name} (${(parami as any).englishName})`);
    }
    console.log(`✅ 10 Paramis seeded\n`);

    // Step 3: Seed expanded practices
    console.log('🎯 Seeding expanded practices...');
    for (const [id, expandedData] of Object.entries(data.expandedPractices)) {
      await setDoc(doc(db, 'expandedPractices', id), {
        ...(expandedData as any),
        updatedAt: serverTimestamp(),
      });
      console.log(`  ✓ Parami ${id}: ${(expandedData as any).practices.length} practices`);
    }
    console.log(`✅ Expanded practices seeded for all 10 Paramis\n`);

    // Step 4: Verification
    console.log('🔍 Verifying data integrity...');
    let totalBasePractices = 0;
    let totalExpandedPractices = 0;

    for (const parami of Object.values(data.paramis)) {
      totalBasePractices += (parami as any).practices.length;
    }

    for (const expandedData of Object.values(data.expandedPractices)) {
      totalExpandedPractices += (expandedData as any).practices.length;
    }

    console.log(`  ✓ Base practices: ${totalBasePractices} (expected: 30)`);
    console.log(`  ✓ Expanded practices: ${totalExpandedPractices} (expected: 200)`);
    console.log(`  ✓ Total practices: ${totalBasePractices + totalExpandedPractices}`);

    console.log('\n🎉 Firestore seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  - Metadata: version 1');
    console.log('  - Paramis: 10 documents');
    console.log('  - Expanded Practices: 10 documents');
    console.log(`  - Total Practices: ${totalBasePractices + totalExpandedPractices}`);
    console.log('\n✅ View your data in Firebase Console:');
    console.log(`   https://console.firebase.google.com/project/${process.env.FIREBASE_PROJECT_ID}/firestore\n`);

  } catch (error) {
    console.error('\n❌ Error seeding Firestore:', error);
    throw error;
  }
}

// Run the seed function
seedFirestore()
  .then(() => {
    console.log('✨ Done! Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
