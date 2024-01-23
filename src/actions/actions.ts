"use server";

import { Message } from "@prisma/client";
import { revalidatePath } from "next/cache";
// import { type Product, type User } from "@prisma/client";
// import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { useChatRoomsStore } from "~/store";
import { ChatRoomModel, ChatRoomType } from "~/utils/types";

export const GetChatRoomMessages = async (userEmail: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          user: {
            email: userEmail,
          },
        },
      },
    },
    include: {
      messages: true,
      users: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const getUsers = async (contains: string) => {
  const users = await db?.user.findMany({
    where: {
      name: {
        contains: contains,
        mode: "insensitive",
      },
      
    },
  });

  return users;
};

export const createChatRoom = async (name: string, userEmails: string[]) => {
  const chatRoom = await db?.chatRoom.create({
    data: {
      name: name,
      users: {
        create: userEmails.map((email) => {
          return {
            user: {
              connect: {
                email: email,
              },
            },
          };
        }),
      },
      
    },
    include: {
      messages: true,
      users: {
        include: {
          user: true,
        },
      },
    }
  });
  return chatRoom;  
  // useChatRoomsStore.getState().addChatRoom(new ChatRoomModel(chatRoom));
  console.log(chatRoom);
  revalidatePath("/");
};

export const getUserImage = async (email: string) => {
  const user = await db?.user.findUnique({
    where: {
      email: email,
    },
  });

  return user?.image;
};


export const deleteChatRoom = async (id: string) => {
  console.log(id);
  const chatRoom = await db?.chatRoom.delete({
    where: {
      id: id,

    },
  });

  revalidatePath("/");
};

export const deleteMessage = async (id: string) => {
  console.log(id);
  const message = await db?.message.delete({
    where: {
      id: id,

    },
  });


}

export const addUsersToChatRoom = async (chatRoomId: string, userEmails: string[]) => { 
  const chatRoom = await db.chatRoom.update({
    where: {
      id: chatRoomId,
    },
    data: {
      users: {
        create: userEmails.map((email) => {
          return {
            user: {
              connect: {
                email: email,
              },
            },
          };
        }),
        
      },
    },  
    
  })
}

export const addSubsciption = async (sub: string, email:string) => {
  const user = await db?.user.update({
    where: {
      email: email,
    },
    data: {
      subscriptions: {
        set: [sub],
        // push: sub,
      },
    },
  })
    
}
const myHeaders = new Headers();
myHeaders.append("Authorization", "Basic e3thcGlfa2V5fX06e3thcGlfc2VjcmV0fX0=");


export async function UploadImage(data: FormData) {
const image = data.get("image") as File;
  const formdata = new FormData();
  let ImageUrl ="" 

    formdata.append("file", image, "[PROXY]");
    formdata.append("upload_preset", "wk8rrmkj");
    formdata.append("api_key", "963212776811178");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    await fetch(
      "https://api.cloudinary.com/v1_1/dsvo76qzw/image/upload",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
       ImageUrl =  JSON.parse(result).secure_url
      })
    .catch((error) => console.log("error", error));
  return ImageUrl;
  }



