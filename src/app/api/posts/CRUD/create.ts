import {  db } from "src/server/db";
import { NextResponse } from "next/server";

export default async function postHandler (req: Request) {
    const post = await req.json();
    const new_post = await db?.post
      .create({
        data: post,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  
    return new NextResponse("created", { status: 200 });
  };