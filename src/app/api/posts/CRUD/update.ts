import {  db } from "src/server/db";
import { NextResponse } from "next/server";
import { title } from "process";

export default async function puthHandler(req: Request) {
  const { searchParams } = new URL(req.url);
  //   const update_var = searchParams.get("update");
  const slug = searchParams.get("slug");
  const data = await req.json();
  const { new_slug, new_title, new_desc, new_img, new_view } = data;
  const post = await db?.post.update({
    where: {
      slug: slug as string,
    },
    data: {
      ...(new_view && { view: new_view }),
      ...(new_slug && { slug: new_slug }),
      ...(new_title && { title: new_title }),
      ...(new_img && { img: new_img }),
      ...(new_desc && { desc: new_desc }),
    },
  });

  return new NextResponse(JSON.stringify(post), {
    status: 200,
  });
}
