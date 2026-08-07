import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Project,
  ProjectState,
  UpdateProjectPayload,
  DeleteProjectPayload,
  FetchProjectsResponse,
} from "./projectType";

export const initialProjectState: ProjectState = {
  projects: null,
  loading: false,
  error: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState: initialProjectState,
  reducers: {
    setProjects: (state, action: PayloadAction<FetchProjectsResponse>) => {
      state.projects = action.payload.projects;
    },

    addProject: (state, action: PayloadAction<Project>) => {
      if (state.projects) {
        state.projects.push(action.payload);
      } else {
        state.projects = [action.payload];
      }
    },

    updateProject: (state, action: PayloadAction<UpdateProjectPayload>) => {
      if (!state.projects) return;

      const index = state.projects.findIndex(
        (project) => project.id === action.payload.id,
      );

      if (index !== -1) {
        state.projects[index] = {
          ...state.projects[index],
          ...action.payload,
        };
      }
    },

    deleteProject: (state, action: PayloadAction<DeleteProjectPayload>) => {
      if (!state.projects) return;

      state.projects = state.projects.filter(
        (project) => project.id !== action.payload.id,
      );
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setLoading,
  setError,
} = projectSlice.actions;

export default projectSlice.reducer;
