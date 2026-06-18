import fs from 'fs/promises';
import path from 'path';

export interface Assessment {
  id: string;
  candidateName: string;
  jdText: string;
  resumeText: string;
  score: number;
  skills: string[];
  experience: number;
  tag: string;
  aiReasoning: string;
  githubUrl?: string;
  createdAt: string;
}

export interface Invitation {
  id: string;
  assessmentId: string;
  candidateName: string;
  score: number;
  tag: string;
  scheduledTime: string;
  status: 'pending' | 'sent' | 'accepted' | 'declined' | 'completed';
  githubUrl?: string;
  createdAt: string;
}

interface DbSchema {
  assessments: Assessment[];
  invitations: Invitation[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Helper to ensure database directory and file exist
async function ensureDb() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch (err) {
    // Ignore if directory already exists
  }

  try {
    await fs.access(DB_FILE);
  } catch (err) {
    // File doesn't exist, create it with empty collections
    const initialDb: DbSchema = { assessments: [], invitations: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  }
}

// Read the database content
async function readDb(): Promise<DbSchema> {
  await ensureDb();
  try {
    const content = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(content) as DbSchema;
  } catch (err) {
    console.error('Error reading JSON DB, resetting:', err);
    const initialDb: DbSchema = { assessments: [], invitations: [] };
    return initialDb;
  }
}

// Write the database content
async function writeDb(data: DbSchema): Promise<void> {
  await ensureDb();
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Exported database client functions
export const db = {
  // Assessment CRUD
  async saveAssessment(assessment: Omit<Assessment, 'id' | 'createdAt'>): Promise<Assessment> {
    const data = await readDb();
    const newAssessment: Assessment = {
      ...assessment,
      id: `asm_${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date().toISOString()
    };
    data.assessments.push(newAssessment);
    await writeDb(data);
    return newAssessment;
  },

  async getAssessment(id: string): Promise<Assessment | null> {
    const data = await readDb();
    return data.assessments.find(a => a.id === id) || null;
  },

  async getAssessments(): Promise<Assessment[]> {
    const data = await readDb();
    return data.assessments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Invitation CRUD
  async saveInvitation(invitation: Omit<Invitation, 'id' | 'createdAt' | 'status'>): Promise<Invitation> {
    const data = await readDb();
    const newInvitation: Invitation = {
      ...invitation,
      id: `inv_${Math.random().toString(36).substring(2, 11)}`,
      status: 'sent',
      createdAt: new Date().toISOString()
    };
    data.invitations.push(newInvitation);
    await writeDb(data);
    return newInvitation;
  },

  async getInvitations(): Promise<Invitation[]> {
    const data = await readDb();
    return data.invitations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async deleteInvitation(id: string): Promise<boolean> {
    const data = await readDb();
    const initialLength = data.invitations.length;
    data.invitations = data.invitations.filter(i => i.id !== id);
    if (data.invitations.length !== initialLength) {
      await writeDb(data);
      return true;
    }
    return false;
  },

  // Clear all databases
  async clearDatabase(): Promise<boolean> {
    const emptyDb: DbSchema = { assessments: [], invitations: [] };
    await writeDb(emptyDb);
    return true;
  }
};
