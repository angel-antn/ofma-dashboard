export interface MusicianResponse {
  totalCount: number;
  result: Musician[];
}

export interface Musician {
  id?: string;
  name: string;
  lastname: string;
  email: string;
  birthdate: Date;
  startDate: Date;
  description: string;
  isHighlighted: boolean;
  gender: string;
  fullname?: string;
  imageUrl?: string;
  concertCount?: number;
  exclusiveContentCount?: number;
}
