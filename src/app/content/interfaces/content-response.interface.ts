export interface ContentResponse {
  totalCount: number;
  result: Content[];
}

export interface Content {
  id: string;
  name: string;
  description: string;
  category: string;
  isHighlighted: boolean;
  isShown: boolean;
  isDraft: boolean;
  imageUrl: string;
  videoUrl: string;
  exclusiveContentMusician: ExclusiveContentMusician[];
}

export interface ExclusiveContentMusician {
  id: string;
  musicianId: string;
  role: string;
  name: string;
  lastname: string;
  fullname: string;
  imageUrl: string;
}
