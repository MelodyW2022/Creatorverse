import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const CREATORS = [
  {
    name: 'Ali Abdaal',
    url: 'https://www.youtube.com/@aliabdaal',
    description: 'Productivity, learning, and creator business videos.',
    imageURL:
      'https://yt3.googleusercontent.com/ytc/AIdro_m2xx6mCZwsyjARnkwBKJxEv0FqGxGS2NwWNkjWH__Smw=s900-c-k-c0x00ffffff-no-rj',
  },
  {
    name: 'Lydia Violet',
    url: 'https://www.twitch.tv/lydiaviolet',
    description: 'A live streamer who mixes gaming, chatting, and cozy variety content.',
    imageURL:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/03b43302-8793-40e4-8825-a714817ae7ad-profile_image-300x300.png',
  },
  {
    name: 'Kevin Stratvert',
    url: 'https://www.youtube.com/@KevinStratvert',
    description: 'Practical tutorials for productivity tools and everyday software.',
    imageURL:
      'https://yt3.googleusercontent.com/ytc/AIdro_lr4ES_dIDpNgSSrKh-AibkIGYafS2IaX2D1aA_8j_-QeIG=s900-c-k-c0x00ffffff-no-rj',
  },
  {
    name: 'Marques Brownlee',
    url: 'https://www.youtube.com/@mkbhd',
    description: 'High-quality tech reviews, product breakdowns, and industry commentary.',
    imageURL:
      'https://yt3.googleusercontent.com/qu4TmIaYUlS41-dJ9gZ7DUR3nilvmB5_11i6OKSdvNnBNiyOusZP1bMN6ICnuxtjFBb6ioKgRQ=s900-c-k-c0x00ffffff-no-rj',
  },
  {
    name: 'Jazza',
    url: 'https://www.youtube.com/@Jazza',
    description: 'Creative art challenges, illustration videos, and playful design experiments.',
    imageURL:
      'https://yt3.googleusercontent.com/NxkGR-9Go3siyXFGk45g7ny7H3yvwm8hkaN6iY4xeekvTCJ_4MvwV-J59Yx1VgfMGACY_Kxx=s900-c-k-c0x00ffffff-no-rj',
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

  const existingCreatorsResponse = await fetch(
    `${restBase}/creators?select=id,url,name,description,imageURL`,
    {
      headers,
    },
  );

  if (!existingCreatorsResponse.ok) {
    throw new Error(
      `Unable to read existing creators: ${existingCreatorsResponse.status} ${existingCreatorsResponse.statusText}`,
    );
  }

  const existingCreators = await existingCreatorsResponse.json();
  const existingByUrl = new Map(existingCreators.map((creator) => [creator.url, creator]));
  const missingCreators = [];
  const creatorsToUpdate = [];

  for (const creator of CREATORS) {
    const existingCreator = existingByUrl.get(creator.url);

    if (!existingCreator) {
      missingCreators.push(creator);
      continue;
    }

    const shouldUpdate =
      existingCreator.name !== creator.name ||
      existingCreator.description !== creator.description ||
      existingCreator.imageURL !== creator.imageURL;

    if (shouldUpdate) {
      creatorsToUpdate.push({ id: existingCreator.id, ...creator });
    }
  }

  console.log(`Found ${existingCreators.length} existing creator(s).`);

  if (creatorsToUpdate.length > 0) {
    console.log(`Would update ${creatorsToUpdate.length} creator(s).`);
  }

  if (missingCreators.length > 0) {
    console.log(`Would insert ${missingCreators.length} creator(s).`);
  }

  if (creatorsToUpdate.length === 0 && missingCreators.length === 0) {
    console.log('No changes needed.');
    return;
  }

  if (dryRun) {
    for (const creator of creatorsToUpdate) {
      console.log(`- update ${creator.name} (${creator.url})`);
    }

    for (const creator of missingCreators) {
      console.log(`- insert ${creator.name} (${creator.url})`);
    }

    return;
  }

  for (const creator of creatorsToUpdate) {
    const updateResponse = await fetch(`${restBase}/creators?id=eq.${creator.id}`, {
      method: 'PATCH',
      headers: {
        ...headers,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        name: creator.name,
        url: creator.url,
        description: creator.description,
        imageURL: creator.imageURL,
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(
        `Unable to update creator ${creator.url}: ${updateResponse.status} ${updateResponse.statusText}\n${errorText}`,
      );
    }
  }

  let insertedCreators = [];

  if (missingCreators.length > 0) {
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
      throw new Error(
        `Unable to insert creators: ${insertResponse.status} ${insertResponse.statusText}\n${errorText}`,
      );
    }

    insertedCreators = await insertResponse.json();
  }

  console.log(
    `Updated ${creatorsToUpdate.length} creator(s) and inserted ${insertedCreators.length} creator(s).`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
