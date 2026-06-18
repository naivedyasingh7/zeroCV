import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface DispatchRequestBody {
  assessmentId: string;
  candidateName: string;
  score: number;
  tag: string;
  githubUrl?: string;
}

export async function POST(request: Request) {
  try {
    const body: DispatchRequestBody = await request.json();
    const { assessmentId, candidateName, score, tag, githubUrl } = body;

    if (!assessmentId || !candidateName) {
      return NextResponse.json({ error: 'Missing assessment ID or candidate name' }, { status: 400 });
    }

    // Calculate next Monday at 10:00 AM for the interview scheduled time
    const nextMonday = new Date();
    // Set to next Monday
    const currentDay = nextMonday.getDay(); // 0 is Sunday, 1 is Monday
    const daysToAdd = (8 - currentDay) % 7 || 7;
    nextMonday.setDate(nextMonday.getDate() + daysToAdd);
    nextMonday.setHours(10, 0, 0, 0);

    const formattedTime = nextMonday.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) + ' at 10:00 AM';

    // Save invitation to database
    const savedInvitation = await db.saveInvitation({
      assessmentId,
      candidateName,
      score,
      tag,
      scheduledTime: formattedTime,
      githubUrl
    });

    return NextResponse.json(savedInvitation);
  } catch (error: any) {
    console.error('Error in dispatch route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
