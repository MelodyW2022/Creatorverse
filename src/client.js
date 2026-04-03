const FUNCTION_NAME = 'creators';
const FUNCTION_ERROR_MESSAGE = 'Unable to reach the creators backend.';

export function getSupabaseClientState() {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    return {
      client: null,
      error:
        'Creatorverse is missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before using the app.',
    };
  }

  return {
    anonKey,
    error: null,
    url,
  };
}

function getCreatorsFunctionUrl(id) {
  const { url } = getSupabaseClientState();
  const functionUrl = new URL(`/functions/v1/${FUNCTION_NAME}`, url);

  if (id !== undefined && id !== null) {
    functionUrl.searchParams.set('id', String(id));
  }

  return functionUrl.toString();
}

async function parseFunctionResponse(response) {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.error || FUNCTION_ERROR_MESSAGE;
    throw new Error(message);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
}

async function requestCreatorsApi(method, { id, body } = {}) {
  const { anonKey, error } = getSupabaseClientState();

  if (error) {
    throw new Error(error);
  }

  const response = await fetch(getCreatorsFunctionUrl(id), {
    method,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  return parseFunctionResponse(response);
}

export async function listCreators() {
  const data = await requestCreatorsApi('GET');
  return data?.creators ?? [];
}

export async function getCreator(id) {
  const data = await requestCreatorsApi('GET', { id });
  return data?.creator ?? null;
}

export async function createCreator(values) {
  const data = await requestCreatorsApi('POST', { body: values });
  return data?.creator ?? null;
}

export async function updateCreator(id, values) {
  const data = await requestCreatorsApi('PATCH', { id, body: values });
  return data?.creator ?? null;
}

export async function deleteCreator(id) {
  await requestCreatorsApi('DELETE', { id });
}
