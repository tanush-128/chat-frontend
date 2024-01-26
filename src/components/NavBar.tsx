"use client";
import { Circle, LogOut, Menu, Settings, Trash2, UserRoundPlus } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { deleteChatRoom } from "~/actions/actions";
import { useChatRoomsStore, useSidebarStore, useSocketStore } from "~/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Switch } from "./ui/switch";
import { useEffect } from "react";

export function NavBar() {
  // const { index, setIndex } = useSidebarStore();
  const { data } = useSession();
  const i = useChatRoomsStore((state) => state.currentChatRoomIndex);
  const chatRoom = useChatRoomsStore
    .getState()
    .chatRooms[i]?.useChatRoomStore((state) => state);

  const online = chatRoom?.online.filter((o) => o.userEmail !== data?.user?.email)!;
  
  useEffect(() => {
    const userpref = localStorage.getItem("save" + chatRoom?.id) 
    if(userpref === null) localStorage.setItem("save" + chatRoom?.id, "true")
    
    useChatRoomsStore.getState().chatRooms[i]?.useChatRoomStore.getState().setSave( userpref ==="true"? true : false )
  }, [i])

  return (
    <div className="b flex-wrap flex justify-between gap-4  bg-bg_2 p-4 ">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
           

            // if (index !== 4) {
            //   setIndex(4);
            // } else {
            //   setIndex(0);
            // }
          }}
        >
          <Menu />
        </button>
        <div className="flex flex-col">

        <span className="text-xl font-medium">
          #{" "}
            {
              (chatRoom?.name === "oneToOne" &&
                chatRoom?.users.length !== 1) ||
              (chatRoom?.name === null && chatRoom?.users.length !== 1)
                ? chatRoom?.users.filter(
                    (chatRoomOnUser) =>
                      chatRoomOnUser.user.email !== data?.user?.email,
                  )[0]?.user.name
                : chatRoom?.name
            // useChatRoomsStore.getState().chatRooms[
            //   useChatRoomsStore((state) => state.currentChatRoomIndex)
            // ]?.name
          }
        </span>
        <span>
            {
              <div className="text-white">
                {
                  online?.map( 
                    (t, index) => (<span>{t.userName} {index === online.length-1 ? " " :","}   </span>)
                    
                )
                
                }
                {
                  online?.length !== 0 &&
                  <span>{online?.length > 1 ? "are" : "is"} online</span>
                }
                {/* <span>{ online?.length}</span> */}
                </div>
                }
        </span>
        </div>
        
      </div>
      <div className="flex justify-end flex-grow items-center gap-2 md:gap-8">

      
      <div className="hidden md:flex gap-2">
          <Switch checked= { useChatRoomsStore.getState().chatRooms[i]?.useChatRoomStore((s)=> s.save)  } onCheckedChange={(checked) => {
            useChatRoomsStore.getState().chatRooms[i]?.useChatRoomStore.getState().setSave(checked)
            localStorage.setItem("save" + chatRoom?.id, checked.toString())
          }} />
        <span>Save Chat</span>
        </div>
        <span>
          {useSocketStore((state) => state.socket).connected ? (
            <span className="text-green-500">
              <Circle size={10} fill="rgb(34 197 94)" />
            </span>
          ) : (
              <span className="text-red-500">
                   <Circle size={10} fill="rgb(239 68 68 )"/>
            </span>
          )
          }
        </span>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {" "}
            <Settings className="text-white" size={24} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-6 bg-white text-gray-500">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button  className="flex items-center gap-2" onClick={()=> signOut()}>
                <LogOut className="text-red-500" size={16} />  Logout

              </button>
            </DropdownMenuItem>
              <DropdownMenuItem>
                 <div className="flex gap-2">
          <Switch  checked= { useChatRoomsStore.getState().chatRooms[i]?.useChatRoomStore((s)=> s.save)  } onCheckedChange={(checked) => {
            useChatRoomsStore.getState().chatRooms[i]?.useChatRoomStore.getState().setSave(checked)
            localStorage.setItem("save" + chatRoom?.id, checked.toString())
          }} />
        <span>Save Chat</span>
        </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="flex items-center gap-2"
                onClick={() => {
                  useSidebarStore.getState().setIndex(2);
                }}
              >
                <UserRoundPlus className="text-red-500" size={16} /> Add Users
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="flex items-center gap-2"
                onClick={() => {
                  deleteChatRoom(chatRoom?.id as string);
                  useChatRoomsStore
                    .getState()
                    .deleteChatRoom(chatRoom?.id as string);
                }}
              >
                <Trash2 className="text-red-500" size={16} /> Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        </div>
    </div>
  );
}
