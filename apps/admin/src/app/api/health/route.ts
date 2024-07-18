/**
 * Expose a simple health check endpoint to ensure app is up and running
 */
export async function GET() {
  return Response.json({ status: 'ok' });
}
