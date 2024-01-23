"use client";
import { Menu, Settings, Trash2, UserRoundPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { deleteChatRoom } from "~/actions/actions";
import { useChatRoomsStore, useSidebarStore } from "~/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function NavBar() {
  // const { index, setIndex } = useSidebarStore();
  const { data } = useSession();
  const i = useChatRoomsStore((state) => state.currentChatRoomIndex);
  const chatRoom = useChatRoomsStore
    .getState()
    .chatRooms[i]?.useChatRoomStore((state) => state);

  const online = chatRoom?.online.filter((o) => o.userEmail !== data?.user?.email)!;
  
  return (
    <div className="b flex justify-between gap-4  bg-bg_2 p-4 ">
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
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {" "}
            <Settings className="text-white" size={24} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-6 bg-white text-gray-500">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
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
  );
}
