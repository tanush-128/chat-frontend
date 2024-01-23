import { getUserImage } from "src/actions/actions";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { useChatRoomsStore, useSocketStore } from "~/store";

const style1 = "flex flex-col items-end";
const style2 = "flex flex-col items-start";
export default function MessageElement({
  message,
  data,
  imageElement
}: {
  message: any;
    data: any;
    imageElement: ReactNode;
}) {

  const deleteMessage = () => {
    // deleteMessage(message.id);
    useChatRoomsStore
      .getState()
      .chatRooms[
        useChatRoomsStore.getState().currentChatRoomIndex
      ]?.useChatRoomStore.getState()
      .deleteMessage(message.id);
    useSocketStore.getState().deleteMessage(message);
  };


  return (
    <div className="group relative flex gap-2 p-1 py-2 hover:bg-message_bg">
      {imageElement}
    
      <div className="">
        <div className="flex items-baseline gap-4">
          <div className="text-lg font-bold">
            {message.userEmail === data?.user?.email ? "You" : message.userName}
          </div>

          <div className="text-sm text-gray-400">
            {new Date(message.createdAt).toLocaleTimeString()}
          </div>
        </div>
        <div
          className="text-lg"
          id="content"
          dangerouslySetInnerHTML={{ __html: message.content }}
        ></div>
      </div>

      {(message.userEmail === data?.user?.email ||
        data?.user.email === "agarwalom128@gmail.com") && (
        <button
          onClick={() => deleteMessage()}
          className="absolute right-2 top-2 hidden group-hover:block"
        >
          <Trash2 className="text-xl text-gray-400" />
        </button>
      )}
    </div>
  );
}
