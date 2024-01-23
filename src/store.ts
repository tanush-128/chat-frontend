import { create } from "zustand";
import { ChatRoomModel } from "./utils/types";
import { ChatRoomOnUser, Message, User } from "@prisma/client";
// import  from "socket.io-client";
import { DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import { Socket } from "socket.io-client";
interface Typing {
  chatRoomId: string;
  userEmail: string;
  userName: string;
  typing: boolean;
}
interface ChatRoomOnUserWithUser extends ChatRoomOnUser {
  user: User;
}

const guideMessages: Message[] = [
  {
    id: "1",
    chatRoomId: "1",
    content: `
    Hey guys, Welcome to my&nbsp;<b> CHAT-app</b>.
This application has features like :-
<ul><li>Register/ login with Gmail</li><li>Add users to chatrooms</li><li><span style="font-size: 1.125rem; background-color: rgb(34 37 41 / var(--tw-bg-opacity)); color: hsl(var(--foreground));">Send beautiful</span><i style="font-size: 1.125rem; background-color: rgb(34 37 41 / var(--tw-bg-opacity)); color: hsl(var(--foreground));"> rich tex</i><span style="font-size: 1.125rem; background-color: rgb(34 37 41 / var(--tw-bg-opacity)); color: hsl(var(--foreground));">t (like this one)</span></li><li><span style="font-size: 1.125rem; background-color: rgb(34 37 41 / var(--tw-bg-opacity)); color: hsl(var(--foreground));">Notification on new message</span></li></ul><span style="font-size: 1.125rem; background-color: rgb(34 37 41 / var(--tw-bg-opacity)); color: hsl(var(--foreground));">Many more features coming ahead with future updates
</span>So use <strike>whatsapp</strike> my CHAT-app
<img src="https://cdn.pixabay.com/photo/2022/05/26/00/20/laughing-7221581_1280.png" style="height:200px" alt="">

    `,
    createdAt: new Date(),
    userEmail: "agarwalom128@gmail.com",
    userName: "Tanush Agarwal",
  },
];

interface Store {
  typing: Typing[];
  messages: Message[];
  users: ChatRoomOnUserWithUser[];
  id: string;
  name: string;
  online: string[];
  setTyping: (typing: Typing[]) => void;
  setMessages: (messages: Message[]) => void;
  setUsers: (users: ChatRoomOnUserWithUser[]) => void;
  setId: (id: string) => void;
  setName: (name: string) => void;
  setOnline: (online: string[]) => void;
}

const useChatRoomStore = create<Store>((set) => ({
  typing: [],
  messages: [],
  users: [],
  id: "",
  name: "",
  online: [],
  setTyping: (typing) => set({ typing }),
  setMessages: (messages) => set({ messages }),
  setUsers: (users) => set({ users }),
  setId: (id) => set({ id }),
  setName: (name) => set({ name }),
  setOnline: (online) => set({ online }),
}));

interface socketStore {
  socket: Socket;
  userOnline: () => void;
  sendUserInfo: (userEmail: string, userName: string) => void;
  setSocket: (socket: Socket) => void;
  deleteMessage: (message: any) => void;
  addChatRooms: (chatRoomIds: string[]) => void;
  setTyping: (typing: Typing) => void;
}

export const useSocketStore = create<socketStore>((set) => ({
  socket: {} as Socket,
  setSocket: (socket) => set({ socket }),
  userOnline: () => {
    set((state) => {
      state.socket.emit("user_online", "hey");
      return state;
    });
  },
  sendUserInfo: (userEmail, userName) => {
    set((state) => {
      state.socket.emit("sendUserInfo", { userEmail, userName });
      return state;
    });
  },
  addChatRooms: (chatRoomIds) => {
    set((state) => {
      state.socket.emit("join_chatrooms", chatRoomIds);
      return state;
    });
  },
  deleteMessage: (message) => {
    set((state) => {
      state.socket.emit("deleteMessage", message);
      return state;
    });
  },
  setTyping: (typing) => {
    set((state) => {
      state.socket.emit("typing", typing);
      return state;
    });
  },
}));

interface ChatRoomsStore {
  chatRooms: ChatRoomModel[];
  currentChatRoomIndex: number;
  setCurrentChatRoomIndex: (index: number) => void;
  addChatRoom: (chatRooms: ChatRoomModel) => void;
  deleteChatRoom: (chatRoomId: string) => void;
}

export const useChatRoomsStore = create<ChatRoomsStore>((set) => ({
  chatRooms: [
    new ChatRoomModel({
      id: "1",
      name: "guide",
      createdAt: new Date(),
      messages: guideMessages,
      userIds: [] as string[],
      users: [] as any,
    }),
  ],
  currentChatRoomIndex: 0,
  setCurrentChatRoomIndex: (index) => set({ currentChatRoomIndex: index }),
  addChatRoom: (chatRoom) =>
    set((state) => ({ chatRooms: [...state.chatRooms, chatRoom] })),
  deleteChatRoom: (chatRoomId) =>
    set((state) => ({
      chatRooms: state.chatRooms.filter(
        (chatRoom) => chatRoom.id !== chatRoomId
      ),
      currentChatRoomIndex: 0,
    })),
}));

interface sidebarStore {
  index: number;
  setIndex: (index: number) => void;
}

export const useSidebarStore = create<sidebarStore>((set) => ({
  index: 0,
  setIndex: (index) => set({ index }),
}));
