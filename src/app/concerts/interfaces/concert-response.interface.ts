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
}
