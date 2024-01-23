import { db } from "src/server/db";

export const GET = async (req: Request) => {
  const searchParams = new URL(req.url);
  const userEmail = searchParams.searchParams.get("userEmail");
  const contains = searchParams.searchParams.get("contains");

  if (userEmail) {
    const user = await db?.user.findUnique({
      where: {
        email: userEmail as string,
      },
    });

    return new Response(JSON.stringify({ userId: user?.id }), { status: 200 });
  }

  if (contains) {
    const users = await db?.user.findMany({
      where: {
        name: {
          contains: contains as string,
          mode: "insensitive",
        },
      },
    });

    return new Response(JSON.stringify({ users }), { status: 200 });
  } else {
    const users = await db?.user.findMany();
    return new Response(JSON.stringify({ users }), { status: 200 });
  }
};

export const POST = async (req: Request) => {
  const body = await req.json();

  const user = await db?.user.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });

  return new Response(JSON.stringify({ userId: user?.id }), { status: 200 });
};
