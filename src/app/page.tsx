"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { GetChatRoomMessages } from "src/actions/actions";
import { ChatRoomsList } from "src/components/channels";
import { useChatRoomsStore, useSidebarStore, useSocketStore } from "src/store";
import { ChatRoomModel } from "src/utils/types";
import ChatRoom from "~/components/ChatRoom";

import { useSwipeable } from "react-swipeable";
import { AddUserToChatRoom } from "~/components/addUserToChatRoom";
import { Search } from "~/components/createChatRoom";
import { handleNotificationSetup } from "~/utils/serviceWorker";
import { socketHandler } from "~/utils/socket";


const init = (data :any) => {
  const chatRoomsIds: string[] = [];
  socketHandler();
  useSocketStore.getState().sendUserInfo(data?.user?.email, data?.user?.name);
  GetChatRoomMessages(data?.user?.email as string).then((chatRooms) => {
    chatRooms.forEach((chatRoom) => {
      chatRoomsIds.push(chatRoom.id);
      
      useChatRoomsStore.getState().addChatRoom(new ChatRoomModel(chatRoom));
    });
  })
    .then(() => {
      useSocketStore.getState().addChatRooms(chatRoomsIds);
    }).then(() => {

      useSocketStore.getState().userOnline();
     });
};

export default function Home() {
  const [openSideBar, setOpenSideBar] = useState<boolean>(true);
  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      setOpenSideBar(false);
    },
  ...{
  delta: 10,                             // min distance(px) before a swipe starts. *See Notes*
  preventScrollOnSwipe: false,           // prevents scroll during swipe (*See Details*)
  trackTouch: true,                      // track touch input
  trackMouse: true,                     // track mouse input
  rotationAngle: 0,                      // set a rotation angle
  swipeDuration: Infinity,               // allowable duration of a swipe (ms). *See Notes*
  touchEventOptions: { passive: true },  // options for touch listeners (*See Details*)
},
});
  const { data, status } = useSession();
  const { index, setIndex } = useSidebarStore();
  const sideBarComps = [
    <ChatRoomsList />,
    <Search />,
    <AddUserToChatRoom />,

  ];
 
  if (status === "unauthenticated") {
    redirect("/login");
  }
  useEffect(() => {
    if (!data?.user?.email) return;
    console.log(data);
    if (data?.user?.email) init(data);

    handleNotificationSetup(data?.user?.email);
    
    return () => {
      console.log("closed");
    };
  }, [data?.user?.email]);
  
 
  

  return (
    <div>
      <div className="relative flex w-full">
        <div
          {...handlers}
          className={
           openSideBar
              ? "absolute z-10 h-full min-w-80 animate-in md:static md:h-auto"
              : "hidden"
          }
          id="sidebar"
       
        >
          {sideBarComps[index]}
        </div>

        <ChatRoom data={data} setOpenSideBar={setOpenSideBar} />
      </div>
      <button
        className="btn"
        onClick={() =>
          status === "authenticated" ? signOut() : redirect("/login")
        }
      >
        {status === "authenticated" ? "Sign Out" : "Sign In"}
      </button>
    </div>
  );
}
