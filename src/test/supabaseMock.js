import { vi } from 'vitest';

export function createListClient(response) {
  return createHybridClient({
    listResponse: response,
    detailResponse: response,
  });
}

export function createDetailClient(response) {
  return createHybridClient({
    listResponse: { data: [], error: null },
    detailResponse: response,
  });
}

export function createHybridClient({
  listResponse,
  detailResponse,
  insertResponse = detailResponse ?? listResponse,
  updateResponse = detailResponse ?? listResponse,
  deleteResponse = { data: null, error: null },
}) {
  const createQuery = (response, singleResponse = response) => {
    const query = {
      select: vi.fn(() => query),
      eq: vi.fn(() => {
        query.isSingle = true;
        return query;
      }),
      isSingle: false,
      maybeSingle: vi.fn().mockResolvedValue(singleResponse),
      then: (onFulfilled, onRejected) => Promise.resolve(response).then(onFulfilled, onRejected),
    };

    return query;
  };

  const listQuery = createQuery(listResponse, detailResponse ?? listResponse);
  listQuery.maybeSingle.mockImplementation(async () =>
    listQuery.isSingle ? detailResponse ?? listResponse : listResponse,
  );
  listQuery.insert = vi.fn(() => createQuery(insertResponse));
  listQuery.update = vi.fn(() => createQuery(updateResponse));
  listQuery.delete = vi.fn(() => createQuery(deleteResponse));

  return {
    from: vi.fn(() => listQuery),
  };
}
