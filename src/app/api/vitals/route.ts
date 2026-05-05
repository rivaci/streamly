export async function POST(req: Request) {
  try {
    const metric = (await req.json()) as {
      name?: string;
      value?: number;
      rating?: string;
      navigationType?: string;
    };
    console.info(
      "[vitals]",
      metric.name,
      typeof metric.value === "number" ? Math.round(metric.value) : metric.value,
      metric.rating ?? "",
      req.headers.get("referer") ?? "",
    );
  } catch {
    // ignore malformed payloads
  }
  return new Response(null, { status: 204 });
}
