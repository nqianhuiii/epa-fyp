export interface StudySession {
  id: string;
  title: string;
  teacherName: string;
  teacherImage?: string;
  date: string;
  description: string;
  meetingLink: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudySessionCardProps {
  session: StudySession;
}
