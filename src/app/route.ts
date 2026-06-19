import { NextResponse } from 'next/server';

export async function GET() {
  const apiDocumentation = {
    service: "ZeroCV Capability Evaluation Engine",
    status: "online",
    version: "1.0.0",
    description: "A headless vector semantic screening & candidate assessment API engine.",
    endpoints: {
      root: {
        path: "/",
        method: "GET",
        description: "Returns API service status and endpoint details."
      },
      evaluate: {
        path: "/api/sandbox/evaluate",
        method: "POST",
        description: "Evaluates a candidate resume and experience against a job description, integrating GitHub stats if provided.",
        body: {
          candidateName: "string (required)",
          jdText: "string (required)",
          resumeText: "string (required)",
          experience: "number (required)",
          githubUrl: "string (optional)"
        }
      },
      dispatch: {
        path: "/api/sandbox/dispatch",
        method: "POST",
        description: "Schedules and dispatches an invitation sync pipeline for an assessed candidate.",
        body: {
          assessmentId: "string (required)",
          candidateName: "string (required)",
          score: "number (required)",
          tag: "string (required)",
          githubUrl: "string (optional)"
        }
      },
      invitationsList: {
        path: "/api/sandbox/invitations",
        method: "GET",
        description: "Lists all current candidate invitations and assessment records."
      },
      invitationsDelete: {
        path: "/api/sandbox/invitations",
        method: "DELETE",
        description: "Deletes a specific invitation by ID or clears the entire sandbox log history.",
        query: {
          id: "string (optional - deletes single item if provided, otherwise clears database)"
        }
      }
    }
  };

  return NextResponse.json(apiDocumentation);
}
