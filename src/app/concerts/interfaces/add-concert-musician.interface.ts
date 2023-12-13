export interface AddConcertMusicianResponse {
  role: string;
  musician: Musician;
  concert: Concert;
  id: string;
}

export interface Concert {
  id: string;
  name: string;
  startDate: Date;
  startAtHour: string;
  isOpen: boolean;
  hasFinish: boolean;
  description: string;
  address: string;
  entriesQty: number;
  pricePerEntry: number;
  concertMusician: ConcertMusician[];
}

export interface ConcertMusician {
  id: string;
  role: string;
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
