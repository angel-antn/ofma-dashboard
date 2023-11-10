export interface MusicianResponse {
  page: number;
  pageSize: number;
  totalCount: number;
  pageCount: number;
  result: Musician[];
}

export interface Musician {
  id: string;
  name: string;
  lastname: string;
  fullname: string;
  birthdate: Date;
  description: string;
  isHighlighted: boolean;
  imageUrl: string;
  gender: string;
}
