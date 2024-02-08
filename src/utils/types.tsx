import { ChatRoom, ChatRoomOnUser, Message, User } from "@prisma/client";
import { stat } from "fs";
import { StoreApi, UseBoundStore, create } from "zustand";

export interface ChatRoomOnUserWithUser extends ChatRoomOnUser {
  user: User;
}

export interface ChatRoomType extends ChatRoom {
  messages: Message[];
  users: ChatRoomOnUserWithUser[];
}

interface Typing {
  chatRoomId: string;
  userEmail: string;
  userName: string;
  typing: boolean;
}

interface Online {
  chatRoomId: string;
  userEmail: string;
  userName: string;
}

export interface Store {
  typing: Typing[];
  messages: Message[];
  users: ChatRoomOnUserWithUser[];
  id: string;
  name: string;
  online:Online[] ;
  save : boolean;
  
  addTyping: (t: Typing[]) => void;
  deleteTyping: (t: Typing) => void;
  addMessage: (messages: Message[]) => void;
  deleteMessage: (messageId: string) => void;
  setUsers: (users: ChatRoomOnUserWithUser[]) => void;
  setId: (id: string) => void;
  setName: (name: string) => void;
  addOnlineUser: (online: Online[]) => void;
  setOffline: (offline: Online) => void;
  setSave : (save : boolean) => void;

}


export class ChatRoomModel {
  id;
  name;
  users;
  useChatRoomStore: UseBoundStore<StoreApi<Store>>;
  constructor(chatRoom: ChatRoomType) {
    this.id = chatRoom.id;
    this.name = chatRoom.name;
    this.users = chatRoom.users;

    this.useChatRoomStore = create<Store>((set) => ({
      typing: [],
      messages: [],
      users: [],
      id: "",
      name: "",
      online: [],
      save: true,
      setSave : (save) => set({save}),
      addTyping: (t) => set((state) =>( {typing: [...state.typing ,...t] })),
      deleteTyping: (t) =>
        set((state) => ({
          typing: state.typing.filter((x)=> x.userEmail !== t.userEmail),
        })), 
      addMessage: (messages) =>
        set((state) => ({ messages: [...state.messages, ...messages] })),
      deleteMessage: (messageId) =>
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== messageId),
        })),
      setUsers: (users) => set({ users }),
      setId: (id) => set({ id }),
      setName: (name) => set({ name }),
      addOnlineUser: (online) =>
        set(
 (state)=>         
          ({ online: [...state.online, ...online] })),
      setOffline: (offline) =>

        set((state) => ({ online: state.online.filter((o) => o.userEmail !== offline.userEmail) })),
    }));
    this.storeInit(chatRoom);
  }
  storeInit(chatRoom: ChatRoomType) {
    chatRoom.messages.forEach((message) => {
      this.useChatRoomStore.getState().addMessage([message]);
    });
    this.useChatRoomStore.getState().setUsers(chatRoom.users);
    this.useChatRoomStore.getState().setId(chatRoom.id);
    this.useChatRoomStore.getState().setName(chatRoom.name!);
    this.useChatRoomStore.getState().addTyping([]);
    // this.useChatRoomStore.getState().addOnlineUser([]);
  }


 
}
