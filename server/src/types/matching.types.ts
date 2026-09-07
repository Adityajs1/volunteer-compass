import { Event, User, UserSkill } from '@prisma/client';

// Used during user-to-event matching calculation
export interface MatchingContext {
  user: User & { skills?: UserSkill[] };
  event: Event & { 
    skills?: { skillId: string }[]; 
    categories?: { categoryId: string }[] 
  };
}

export interface MatchScoreResult {
  score: number;
  reasons: string[];
}

export interface RecommendedEvent extends MatchScoreResult {
  eventId: string;
}

export interface RecommendedVolunteer extends MatchScoreResult {
  userId: string;
}
