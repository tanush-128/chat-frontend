import { db } from "src/server/db";
import { NextResponse } from "next/server";

export default  async function getHandler (req: Request){
    
    const { searchParams } = new URL(req.url);
    if (!searchParams.has("slug")) {
      const posts = await db?.post.findMany();
      try {
        return new NextResponse(JSON.stringify(posts), { status: 200 });
      } catch (e: any) {
        return new Response(e.message);
      }
    }
    const slug = searchParams.get("slug");
    console.log(slug);
    const post = await db?.post.findUnique({
      where: {
        slug: slug as string,
      },
    });
    console.log(post);
    try {
      return new NextResponse(JSON.stringify(post), { status: 200 });
    } catch (e: any) {
      return new Response(e.message);
    }
  };
  