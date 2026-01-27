export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectState {
  projects: Project[] | null;
  loading: boolean;
  error: string | null;
}

export interface CreateProjectPayload {
  name: string;
  description: string;
}

export interface UpdateProjectPayload {
  id: string;
  name?: string;
  description?: string;
}

export interface DeleteProjectPayload {
  id: string;
}

export interface FetchProjectsResponse {
  projects: Project[];
}
export interface FetchProjectResponse {
  project: Project;
}
