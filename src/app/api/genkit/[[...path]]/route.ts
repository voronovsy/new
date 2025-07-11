
import {NextRequest} from 'next/server';
import {createNextApiHandler} from '@genkit-ai/next';
import '@/ai/dev'; // Make sure your flows are imported

const handler = createNextApiHandler();

export async function POST(req: NextRequest) {
  return handler(req);
}
