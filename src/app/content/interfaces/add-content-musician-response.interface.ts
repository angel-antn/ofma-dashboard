export interface AddContentMusicianResponse {
  role: string;
  musician: Musician;
  exclusiveContent: ExclusiveContent;
  id: string;
}

export interface ExclusiveContent {
  id: string;
  name: string;
  description: string;
  category: string;
  isHighlighted: boolean;
  isShown: boolean;
  isDraft: boolean;
}

export interface Musician {
  id: string;
  name: string;
  lastname: string;
  email: string;
  birthdate: Date;
  startDate: Date;
  description: string;
  isHighlighted: boolean;
  gender: string;
}
