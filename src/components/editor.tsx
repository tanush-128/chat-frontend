"use-client";
import { useChatRoomsStore, useSocketStore } from "src/store";
// import { socket } from "@/app/page";
import "remixicon/fonts/remixicon.css";
import { UploadImage } from "~/actions/actions";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSession } from "next-auth/react";

export const SendMessage = ({
  chatRoomId,
  data,
}: {
  chatRoomId: string;
  data: any;
}) => {
  const socket = useSocketStore((state) => state.socket);
  function sendMessage(content: string) {
    const _msg = {
      content: content,
      chatRoomId: chatRoomId,
      userEmail: data?.user?.email,
      userName: data?.user?.name,
    };
      useSocketStore.getState().setTyping({
                chatRoomId: useChatRoomsStore.getState().chatRooms[
                  useChatRoomsStore.getState().currentChatRoomIndex
                  ]?.id as string,
                typing: false,
                userEmail: data?.user?.email as string,
                userName: data?.user?.name as string,
              });
    if (useChatRoomsStore.getState().currentChatRoomIndex !== 0) {
      if (socket) {
        socket.emit("message", _msg);
           
      }
    }
  }

  return (
    <div className="b rounded-lg bg-message_bg p-2 ">
      <Editor sendMessage={sendMessage} />
    </div>
  );
};
const className = "border-2  rounded w-full p-4 py-8";
export function Editor({ sendMessage }: { sendMessage: Function }) {
  const [typing, setTyping] = useState(false);
 const {data}=  useSession()
  const [files, setFiles] = useState<File[]>([]);

  const [ImagePicker, setImagePicker] = useState(false);
  function ToogleBold() {
    const editor = document.querySelector(".editor") as HTMLElement;
    editor?.addEventListener("", () => {});
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    for (const file of acceptedFiles) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        alert("Only jpeg and png files are allowed");
        return;
      } else {
        const data = new FormData();
        data.append("image", file);
        UploadImage(data).then((res) => {
          console.log(res);
          const editor = document.querySelector(
            "#editor-content",
          ) as HTMLElement;
          editor.innerHTML += `<img src="${res}" style="height:200px"  alt=""/>`;
        });
        // const socket = new WebSocket("ws://localhost:3002");
 
          
     
        //   socket.onopen = () => {
        //     socket.send(file);
        //   };
        

        setFiles((prev) => [...prev, file]);
      }
    }
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  function link() {
    var url = prompt("Enter the URL");
    document.execCommand("createLink", false, url as string);
  }
  function onSend() {
    const editor = document.querySelector("#editor-content") as HTMLElement;
    console.log(editor?.innerHTML);
    if (editor?.innerHTML !== "<br>" && editor?.innerHTML !== "") {
      const _msg = editor.innerHTML
        .replace(/<div>/g, "<br>")
        .replace(/<\/div>/g, "")
        .replace(/<br>/g, "\n");
      sendMessage(_msg);
      editor.innerHTML = "";
      setImagePicker(false);
      setFiles([]);
    }
  }
  function typingTimeoutFunction() {
    setTimeout(() => {
      setTyping(false);
       useSocketStore.getState().setTyping({
                chatRoomId: useChatRoomsStore.getState().chatRooms[
                  useChatRoomsStore.getState().currentChatRoomIndex
                  ]?.id as string,
                typing: false,
                userEmail: data?.user?.email as string,
                userName: data?.user?.name as string,
              });
    }, 5000);
  }
  return (
    <div>
      <div className="relative p-2">
        <div>
          <button
            className="p-2"
            onClick={() => document.execCommand("bold", false, "")}
          >
            <i className="ri-bold text-xl text-white"></i>
          </button>
          <button
            className="p-2"
            onClick={() => document.execCommand("italic", false, "")}
          >
            <i className="ri-italic text-xl text-white"></i>
          </button>
          <button
            className="p-2"
            onClick={() => document.execCommand("strikeThrough", false, "")}
          >
            <i className="ri-strikethrough text-xl text-white"></i>
          </button>

          <button
            className="p-2"
            onClick={() => document.execCommand("insertorderedlist")}
          >
            <i className="ri-list-ordered text-xl"></i>
          </button>
          <button
            className="p-2"
            onClick={() => document.execCommand("insertunorderedlist")}
          >
            <i className="ri-list-unordered text-xl"></i>
          </button>

          {/* <input type="file" id="file" placeholder="Image" className="" /> */}

          <button
            className="p-2"
            onClick={() => {
              setImagePicker(true);
              // const url = prompt("Enter the URL");
            }}
          >
            Image
          </button>
        </div>
        <div
          contentEditable
          className=" overflow-y-auto border-none text-lg outline-none"
          id="editor-content"
          // style={{ minHeight: "24px", maxHeight: "108px" }}
          onChange={(e) => {
           console.log(e);

          }}
          onInput={() => {
          
            const editor = document.querySelector(
              "#editor-content",
            ) as HTMLElement;
            const html = editor.innerHTML;
            
            if (html === "<br>" || html === "") {
              setTyping(false);
           
              useSocketStore.getState().setTyping({
                chatRoomId: useChatRoomsStore.getState().chatRooms[
                  useChatRoomsStore.getState().currentChatRoomIndex
                  ]?.id as string,
                typing: false,
                userEmail: data?.user?.email as string,
                userName: data?.user?.name as string,
              });
              editor.innerHTML = "";
            }
            else {
              if (typing === false) {
                setTyping(true);
                typingTimeoutFunction();
                useSocketStore.getState().setTyping({
                chatRoomId: useChatRoomsStore.getState().chatRooms[
                  useChatRoomsStore.getState().currentChatRoomIndex
                  ]?.id as string,
                typing:true,
                userEmail: data?.user?.email as string,
                userName: data?.user?.name as string,
              });
              
              }
            }
        
          }}
          onKeyDown={(e) => {
            if (!navigator.userAgent.match(/Android/i)) {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }
          }}
        >
          <p>
            <br />
          </p>
        </div>
        <div className="absolute bottom-0 right-0">
          <button className="btn" onClick={onSend}>
            Send
          </button>
        </div>
      </div>
      {ImagePicker && files.length === 0 && (
        <div className="absolute top-0 flex h-svh w-full items-center justify-center">
          <div className="b rounded-2xl bg-white p-8 text-black  shadow-inner shadow-blue-500">
            <div {...getRootProps({ className: className })}>
              {files.length <= 5 ? (
                <div>
                  <input
                    {...getInputProps({
                      accept: "image/*",
                      className: className,
                    })}
                  />
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>
                      Drag &apos;n&apos; drop some files here, or click to
                      select files
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p>Only 5 files are allowed</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
