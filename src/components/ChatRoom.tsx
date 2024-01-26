import { ReactNode, Suspense, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { useChatRoomsStore, useSidebarStore } from "src/store";
import { NavBar } from "./NavBar";
import { SendMessage } from "./editor";
import MessageElement from "./message";
import Image from "next/image";

export default function ChatRoom({ data,setOpenSideBar }: { data: any,setOpenSideBar:Function }): ReactNode {
  const i = useChatRoomsStore((state) => state.currentChatRoomIndex);
  const {setIndex,index} = useSidebarStore()
  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
     setOpenSideBar(true)
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
const chatRoom = useChatRoomsStore
    .getState()
    .chatRooms[i]?.useChatRoomStore((state) => state);
// const chatRoom = useChatRoomsStore((state) => state.chatRooms[i])?.useChatRoomStore((state) => state);

  const messagesList = useRef<HTMLDivElement>(null);
  const messages = chatRoom?.messages;
  const typing = chatRoom?.typing
    
  const imageElements = chatRoom?.users?.reduce((acc, user) => {

    if (!acc[user.user.email]) acc[user.user.email] = []
    
        acc[user.user.email].push ( <div className="min-w-12 w-12 h-12 rounded-md overflow-hidden">
          <Image src={user.user.image!} alt="" width={100} height={100} />
        </div>)
        return acc
  }, {} as any);


  // const imageElements = imageUrls?.map((url) => {
  //   return (
  //     <div className="w-8 h-8 rounded-full overflow-hidden">
  //       <img src={url!} alt="" width={100} height={100} />
  //     </div>
  //   );
  // });

  const messagesByDate = messages?.reduce((acc, message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(message);
    return acc;
  }, {} as any);
  

  // if new message is added, scroll to bottom
  useEffect(() => {
    if (messagesList.current) {
      console.log(
        messagesList.current.scrollTop,
        messagesList.current.scrollHeight,
      );
      messagesList.current.scrollTop = messagesList.current.scrollHeight;
    }
    console.log("scroll");

  }, [chatRoom]);

  return (
    <div {...handlers} className="b h-screen col-span-9">
      <div className=" box-border  flex h-full flex-col bg-bg_2 ">
        <div className="text-white">
          <div>
           <NavBar />
         
          </div>
        </div>
        <div
          className="flex h-full  flex-col overflow-y-auto py-5"
          id="messages_list"
          ref={messagesList}
        >
          <Suspense fallback={<div>Loading...</div>}>
            {chatRoom && Object.keys(messagesByDate).map((date) => {
              return (
                <div className="b w-full">
                  <div key={date}>
                    <div className=" b mx-auto max-w-fit -translate-y-1/2 rounded-full bg-bg_2 px-5 py-2 text-center text-sm text-white">
                      {date}
                    </div>
                    {messagesByDate[date].map((message: any) => {
                      return (
                        <MessageElement
                          key={message.id}
                          message={message}
                          data={data}
                          imageElement={
                            imageElements[message.userEmail] || (
                              <div className="w-12 h-12 rounded-md overflow-hidden">
                                <img
                                  src={data?.user?.image!}
                                  alt=""
                                  width={100}
                                  height={100}
                                />
                              </div>
                            )
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {
              typing?.map(
                (t) => {
                  return <div className="text-white px-2">{t.userName} is typing ....</div>
                }
                )
            }
          </Suspense>
        </div>

        <div className="bottom-2 w-full   p-2">
          <SendMessage chatRoomId={chatRoom?.id as string} data={data} />
        </div>
      </div>
    </div>
  );
}
