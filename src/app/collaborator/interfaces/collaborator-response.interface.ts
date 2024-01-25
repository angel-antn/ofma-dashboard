export interface CollaboratorsResponse {
  totalCount: number;
  result: Collaborator[];
}

export interface Collaborator {
  id: string;
  email: string;
  name: string;
  lastname: string;
  isCollaborator: boolean;
  fullname: string;
}
