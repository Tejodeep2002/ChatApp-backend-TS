// User Slice
interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    image: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  //Message
  interface Message {
    id: string;
    sender: User;
    content: string;
    chat:Chat;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Chat
  interface Chat {
    id: string;
    chatName: string;
    description?: string;
    groupImage?: string;
    isGroupChat: boolean;
    users: User[];
    latestMessage?: Message | null;
    groupAdmin?: User | null;
    createdAt: Date;
    updatedAt: Date;
  }