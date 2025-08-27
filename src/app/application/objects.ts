export interface CreateResponse{
  id: string;
}

export class SearchRequest {
  pageNumber?: number;
  pageSize?: number;
  sort?: string;
  direction?: string;
  queryType?: string;
  filters?: Map<string, string>
}

export interface Pageable {
  currentPage: number,
  perPage: number,
  total: number,
  items: any[]
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  description: string;
  category: string;
  amountUsed: number;
}

export interface TagColor {
  name: string;
  color: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  roles?: UserRole;
  profilePictureUrl?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  owner: User,
  members: User[] | [];
  projectCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  workspace: Workspace;
  createdAt: Date;
  updatedAt: Date;
}

export enum QuestionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  RESOLVED = 'RESOLVED'
}

export interface Question {
  id: string;
  title: string;
  description: string;
  status: QuestionStatus;
  authorId: string;
  projectId: string;
  tagsId: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  questionId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TargetType {
  NOTE = 'NOTE',
  QUESTION = 'QUESTION',
  ANSWER = 'ANSWER'
}

export interface Comment{
  id: string;
  content: string;
  targetType: TargetType;
  targetId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  version: number;
  projectId: string;
  authorId: string;
  tagsId: string[];
  createdAt: Date;
  updatedAt: Date;
}
