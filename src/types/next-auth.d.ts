import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      firstName?: string;
      lastName?: string;
      jobTitle?: string;
      timezone?: string;
      language?: string;
      profileImage?: string;
    }
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    timezone?: string;
    language?: string;
    profileImage?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    timezone?: string;
    language?: string;
    profileImage?: string;
  }
}

export {};