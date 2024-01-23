import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { GetChatRoomMessages } from "src/actions/actions";
import { useChatRoomsStore, useSidebarStore } from "src/store";

export const ChatRoomsList = ({}: {}) => {
  const { data } = useSession();
  const { setCurrentChatRoomIndex, currentChatRoomIndex } = useChatRoomsStore(
    (state) => state,
  );
  const chatRooms = useChatRoomsStore((state) => state.chatRooms);

  const className = {
    active:
      "flex gap-2 items-center text-lg text-zinc-400  px-2  rounded-md mx-2 bg-blue-500/60",
    inactive:
      "flex gap-2 items-center text-lg text-zinc-400 px-2 hover:bg-gray-600/40 rounded-md mx-2",
  };

  return (
    <div className="b h-full  bg-bg_1 ">
      <div className="flex gap-2  bg-white px-1">
        <input
          className="w-full rounded-sm p-2"
          type="text"
          placeholder="Search"
        />
        <button
          className="text-4xl font-extrabold text-black"
          onClick={() => {
            useSidebarStore.getState().setIndex(1);
          }}
        >
          <Plus />
        </button>
      </div>
      <div className="b p-2">Channels</div>
      {chatRooms?.map((chatRoom, index) => {
        return (
          <div
            onClick={() => {
              setCurrentChatRoomIndex(index);
              GetChatRoomMessages(chatRoom.id);
            }}
            key={chatRoom.id}
            className=""
          >
            <div
              className={
                currentChatRoomIndex === index
                  ? className.active
                  : className.inactive
              }
            >
              <span className="text-2xl"> # </span>
              {(chatRoom?.name === "oneToOne" &&
                chatRoom?.users.length !== 1) ||
              (chatRoom?.name === null && chatRoom?.users.length !== 1)
                ? chatRoom?.users.filter(
                    (chatRoomOnUser) =>
                      chatRoomOnUser.user.email !== data?.user?.email,
                  )[0]?.user.name
                : chatRoom?.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
