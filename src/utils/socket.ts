import { useChatRoomsStore, useSocketStore } from "src/store";

import { io } from "socket.io-client";

export const socketHandler = () => {
  // const socket = io("http://localhost:3001");
  const socket = io("https://chat-appbackend.azurewebsites.net");
  socket.on("connect", () => {
    console.log("connected");
  });
  useSocketStore.getState().setSocket(socket);
  socket.on("message", (message) => {
    useChatRoomsStore.getState().chatRooms.forEach((chatRoom) => {
      if (chatRoom.id === message.chatRoomId) {
        chatRoom.useChatRoomStore.getState().addMessage([message]);
      }
    });
  });
  socket.on("deleteMessage", (message) => {
    useChatRoomsStore.getState().chatRooms.forEach((chatRoom) => {
      if (chatRoom.id === message.chatRoomId) {
        chatRoom.useChatRoomStore.getState().deleteMessage(message.id);
      }
    });
  });
  socket.on("userOnline", (user) => {
    console.log(user);
    useChatRoomsStore.getState().chatRooms.forEach((chatRoom) => {
      if (chatRoom.id === user.chatRoomId) {
        if (
          !chatRoom.useChatRoomStore
            .getState()
            .online.map((u) => u.userEmail)
            .includes(user.userEmail)
        ) {
          chatRoom.useChatRoomStore.getState().addOnlineUser([user]);
        }

        // chatRoom.useChatRoomStore.getState().online.includes(user)
      }
    });
  });
  socket.on("userOffline", (user) => {
    console.log(user);
    useChatRoomsStore.getState().chatRooms.forEach((chatRoom) => {
      if (chatRoom.id === user.chatRoomId) {
        chatRoom.useChatRoomStore.getState().setOffline(user);
      }
    });
  });
  socket.on("typing", (typing) => {
    if (typing.typing) {
      useChatRoomsStore.getState().chatRooms.forEach((chatRoom) => {
        if (chatRoom.id === typing.chatRoomId) {
          chatRoom.useChatRoomStore.getState().addTyping([typing]);
        }
      });
    } else {
      useChatRoomsStore.getState().chatRooms.forEach((chatRoom) => {
        if (chatRoom.id === typing.chatRoomId) {
          chatRoom.useChatRoomStore.getState().deleteTyping(typing);
        }
      });
    }
  });
};
