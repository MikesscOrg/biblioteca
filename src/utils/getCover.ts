export async function fetchCoverUrl(title: string, author?: string): Promise<string | null> {
  const q = encodeURIComponent(`${title} ${author ?? ''}`.trim());
  const url = `https://openlibrary.org/search.json?q=${q}&limit=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const doc = data?.docs?.[0];
    if (!doc) return null;
    const coverId = doc.cover_i;
    if (coverId) return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
    return null;
  } catch (e) {
    return null;
  }
}
