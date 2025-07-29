export interface User {
    id: string;
    name: string;
    email: string;
  }
  
  export interface Note {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isLoading: boolean;
  }
  