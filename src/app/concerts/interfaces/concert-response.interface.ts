export interface ConcertResponse {
  totalCount: number;
  result: Concert[];
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
  imageUrl: string;
  concertMusician: ConcertMusician[];
}

export interface ConcertMusician {
  id: string;
  musicianId: string;
  role: string;
  name: string;
  lastname: string;
  fullname: string;
  imageUrl: string;
}
