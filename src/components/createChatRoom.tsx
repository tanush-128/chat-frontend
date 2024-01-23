"use client";
import { Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { createChatRoom, getUsers } from "src/actions/actions";
import { useChatRoomsStore, useSidebarStore, useSocketStore } from "src/store";
import { ChatRoomModel } from "src/utils/types";

export function Search() {
  const { data } = useSession();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    search();
  }, []);

  function search() {
    getUsers(searchInput).then((res) => {
      setSearchResults(res as any);
    });
  }

  const onClickHandle = () => {
    if (selectedUsers.length === 0) return;
    let chatRoomName = "";
    if (selectedUsers.length >= 1) {
      if (!nameRef.current?.value || nameRef.current?.value === "") {
        chatRoomName = selectedUsers.length > 1 ? "group" : "oneToOne";
      } else {
        chatRoomName = nameRef.current?.value;
      }
    }
    createChatRoom(chatRoomName, [
      ...selectedUsers.map((u) => u.email),
      data?.user?.email,
    ]).then((chatroom) => {
      useSocketStore.getState().addChatRooms([chatroom.id]);
      useChatRoomsStore.getState().addChatRoom(new ChatRoomModel(chatroom));
    });
    useSidebarStore.getState().setIndex(0);
  };

  const className = {
    active:
      "flex gap-2 py-1 items-center justify-between text-lg text-zinc-400  px-2  rounded-md mx-2 bg-blue-500/60",
    inactive:
      "flex gap-2 py-1 items-center justify-between text-lg text-zinc-400 px-2 hover:bg-gray-600/40 rounded-md mx-2",
  };
  return (
    <div className="b relative  h-full bg-bg_1">
      <div className="flex gap-2 rounded-t-lg bg-white px-4">
        <button
          className="text-4xl font-extrabold text-black"
          onClick={() => {
            useSidebarStore.getState().setIndex(0);
          }}
        >
          <X />
        </button>
        <input
          className="w-full rounded-sm p-2 outline-none"
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setSearchInput(e.target.value);
            search();
          }}
        />
      </div>
      <div className="mt-4 flex flex-col gap-1">
        {searchResults
          ?.filter((user) => user.email !== data?.user?.email)
          .map((user) => {
            return (
              <div
                key={user.email}
                className={
                  selectedUsers.filter((u) => u.email === user.email).length > 0
                    ? className.active
                    : className.inactive
                }
              >
                <div>
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-xs">{user.email}</div>
                </div>
                <button
                  className="btn"
                  onClick={() => {
                    selectedUsers.filter((u) => u.email === user.email).length >
                    0
                      ? setSelectedUsers([
                          ...selectedUsers.filter(
                            (u) => u.email !== user.email,
                          ),
                        ])
                      : setSelectedUsers([...selectedUsers, user]);
                  }}
                >
                  {selectedUsers.filter((u) => u.email === user.email).length >
                  0 ? (
                    <X />
                  ) : (
                    <Plus />
                  )}
                </button>
              </div>
            );
          })}
      </div>

      <div className="absolute bottom-0 flex justify-between gap-2 px-2">
        {selectedUsers.length > 1 && (
          <input
            type="text"
            placeholder="Enter chat room name"
            id="name"
            ref={nameRef}
            className="w-48 rounded-md p-2 text-black outline-none"
          />
        )}
        <button
          className="rounded-md bg-message_bg p-2 "
          onClick={() => onClickHandle()}
        >
          Create
        </button>
      </div>
    </div>
  );
}
