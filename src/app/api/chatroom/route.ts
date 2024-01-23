import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { db } from "src/server/db";
interface RequestBody {
  name: string;
  userEmails: string[];
}
export const POST = async (req: Request, res: Response) => {

  const rquestBody: RequestBody = await req.json();
  console.log(rquestBody.userEmails);

  try {
    const chatRoom = await db?.chatRoom.create({
      data: {
        name: rquestBody.name,
        users: {
          create: rquestBody.userEmails.map((email) => {
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
    });

    console.log(chatRoom);
  } catch (e) {
    console.log(e);
  }
  return new NextResponse("created", { status: 200 });
};

export const GET = async (req: Request) => {
  const searchParams = new URL(req.url);
  const userEmail = searchParams.searchParams.get("userEmail");
  const chatRooms = await db?.chatRoom.findMany({
    where: {
      users: {
        some: {
          user: {
            email: userEmail as string,
          },
        },
      },
    },
  });
  var res = [];
  interface findChatRoomOnUser {
    chatRoomName: string | null;
    chatRoomId: string;
    users: User[];
  }
  if (chatRooms) {
    for (let chatRoom of chatRooms) {
      const _res: findChatRoomOnUser = {
        chatRoomName: chatRoom.name,
        chatRoomId: chatRoom.id,
        users: [],
      };
      const ChatRoomOnUsers = await db?.chatRoomOnUser.findMany({
        where: {
          chatRoomId: chatRoom.id,
        },
      });
      if (ChatRoomOnUsers) {
        for (let ChatRoomOnUser of ChatRoomOnUsers) {
          const user = await db?.user.findUnique({
            where: {
              id: ChatRoomOnUser.userId,
            },
          });
          if (user) {
            _res.users.push(user);
          }
        }

        res.push(_res);
      }
    }
  }

  return new NextResponse(JSON.stringify(res), { status: 200 });
};
