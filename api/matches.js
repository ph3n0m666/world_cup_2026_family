export default async function handler(req, res) {
  const API_URL = "https://fixturedownload.com/feed/json/fifa-world-cup-2026";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      return res.status(502).json({
        error: `Failed to load fixtures: ${response.status} ${response.statusText}`,
      });
    }

    const data = await response.json();

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({
      error: "Unable to proxy fixtures API",
      details: error.message,
    });
  }
}
