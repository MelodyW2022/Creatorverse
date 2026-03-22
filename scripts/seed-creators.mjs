import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const CREATORS = [
  {
    name: 'Ali Abdaal',
    url: 'https://www.youtube.com/@aliabdaal',
    description: 'Productivity, learning, and creator business videos.',
    imageURL: 'https://i.ytimg.com/vi/4d6x1u6fPqY/maxresdefault.jpg',
  },
  {
    name: 'Lydia Violet',
    url: 'https://www.twitch.tv/lydiaviolet',
    description: 'A live streamer who mixes gaming, chatting, and cozy variety content.',
    imageURL: 'https://static-cdn.jtvnw.net/jtv_user_pictures/lydiaviolet-profile_image-8c7c2c16b7b7c3d7-300x300.jpeg',
  },
  {
    name: 'Kevin Stratvert',
    url: 'https://www.youtube.com/@KevinStratvert',
    description: 'Practical tutorials for productivity tools and everyday software.',
    imageURL: 'https://i.ytimg.com/vi/4Z4iM6q1Rz4/maxresdefault.jpg',
  },
  {
    name: 'Marques Brownlee',
    url: 'https://www.youtube.com/@mkbhd',
    description: 'High-quality tech reviews, product breakdowns, and industry commentary.',
    imageURL: 'https://i.ytimg.com/vi/K1Qh8rX3w8E/maxresdefault.jpg',
  },
  {
    name: 'Jazza',
    url: 'https://www.youtube.com/@Jazza',
    description: 'Creative art challenges, illustration videos, and playful design experiments.',
    imageURL: 'https://i.ytimg.com/vi/0Qx8Kj4d1fE/maxresdefault.jpg',
  },
];

function parseEnvFile(contents) {
  const env = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

async function loadEnv() {
  const env = { ...process.env };
  const localEnvPath = path.resolve(process.cwd(), '.env.local');

  if (existsSync(localEnvPath)) {
    const fileContents = await readFile(localEnvPath, 'utf8');
    Object.assign(env, parseEnvFile(fileContents));
  }

  return env;
}

function normalizeBaseUrl(url) {
  return url.replace(/\/$/, '');
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  const env = await loadEnv();
  const baseUrl = env.VITE_SUPABASE_URL?.trim();
  const anonKey = env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!baseUrl || !anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in the environment or .env.local.',
    );
  }

  const restBase = `${normalizeBaseUrl(baseUrl)}/rest/v1`;
  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Prefer: 'return=minimal',
  };

  const existingResponse = await fetch(`${restBase}/creators?select=url`, {
    headers,
  });

  if (!existingResponse.ok) {
    throw new Error(`Unable to read existing creators: ${existingResponse.status} ${existingResponse.statusText}`);
  }

  const existingCreators = await existingResponse.json();
  const existingUrls = new Set(existingCreators.map((creator) => creator.url));
  const missingCreators = CREATORS.filter((creator) => !existingUrls.has(creator.url));

  console.log(`Found ${existingUrls.size} existing creator(s).`);

  if (missingCreators.length === 0) {
    console.log('No new creators to insert.');
    return;
  }

  console.log(`Would insert ${missingCreators.length} creator(s).`);

  if (dryRun) {
    for (const creator of missingCreators) {
      console.log(`- ${creator.name} (${creator.url})`);
    }

    return;
  }

  const insertResponse = await fetch(`${restBase}/creators`, {
    method: 'POST',
    headers: {
      ...headers,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(missingCreators),
  });

  if (!insertResponse.ok) {
    const errorText = await insertResponse.text();
    throw new Error(`Unable to insert creators: ${insertResponse.status} ${insertResponse.statusText}\n${errorText}`);
  }

  const insertedCreators = await insertResponse.json();
  console.log(`Inserted ${insertedCreators.length} creator(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
