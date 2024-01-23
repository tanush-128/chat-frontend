import { NextResponse } from "next/server";
import postHandler from "./CRUD/create";
import getHandler from "./CRUD/read";
import puthHandler from "./CRUD/update";
import deleteHandler from "./CRUD/delete";

export const GET = getHandler;

export const POST = postHandler;

export const PUT = puthHandler;

export const DELETE = deleteHandler;

