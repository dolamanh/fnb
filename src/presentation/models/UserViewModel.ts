// Presentation Models for displaying data in UI

export interface UserViewModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isActive: boolean;
  displayName: string;        // Formatted name for display
  contactInfo: string;        // Formatted contact info
  statusText: string;         // Human readable status
  statusColor: string;        // Color for status indicator
  initials: string;          // First letters of name for avatar
  createdAtFormatted: string; // Formatted date for display
  updatedAtFormatted: string; // Formatted date for display
}

export interface UserListViewModel {
  users: UserViewModel[];
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  error?: string;
}

export interface UserFormViewModel {
  id?: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isActive: boolean;
  // Form validation
  nameError?: string;
  emailError?: string;
  phoneError?: string;
  // Form state
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

export interface UserDetailViewModel {
  user: UserViewModel;
  isLoading: boolean;
  error?: string;
  // Actions
  canEdit: boolean;
  canDelete: boolean;
  canActivate: boolean;
  canDeactivate: boolean;
}
