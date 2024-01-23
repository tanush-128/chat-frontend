"use client";
import { Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  addUsersToChatRoom,
  getUsers
} from "src/actions/actions";
import { useChatRoomsStore, useSidebarStore } from "src/store";

export function AddUserToChatRoom() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const { data } = useSession();

  useEffect(() => {
    search();
  }, []);

  function search() {
    getUsers(searchInput).then((res) => {
      setSearchResults(res as any);
    });
  }

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
        <button
          className="rounded-md bg-message_bg p-2 "
          onClick={() => {
            addUsersToChatRoom(
              useChatRoomsStore.getState().chatRooms[
                useChatRoomsStore.getState().currentChatRoomIndex
              ]!.id,
              selectedUsers.map((user) => user.email),
            );
          }}
        >
          Add Selected Users
        </button>
      </div>
    </div>
  );
}
