import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const invitations = await db.getInvitations();
    return NextResponse.json(invitations);
  } catch (error: any) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const deleted = await db.deleteInvitation(id);
      return NextResponse.json({ success: deleted });
    } else {
      const cleared = await db.clearDatabase();
      return NextResponse.json({ success: cleared });
    }
  } catch (error: any) {
    console.error('Error deleting/clearing invitations:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
