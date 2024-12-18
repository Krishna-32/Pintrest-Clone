import connectToDB from "../../../../libs/mongodb";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import Pin from "../../../../models/pins";
import User from "../../../../models/users";
import Comment from "../../../../models/comments";

export async function POST(request, { params }) {
 try {
  connectToDB();

  const token = await getToken({ req : request })

  if (!token) {
   return NextResponse.json({ success: false, error: "Unauthorized Access" }, { status: 401 })
  }

  const { id } = await params;
  const pin = await Pin.findById(id);

  if (!pin) {
    return NextResponse.json({ success: false, error: "Pin not found" }, { status: 404 });
  }

  const formData = await req.formData();

  const username = formData.get('user');
  const comment = formData.get('comment');
  const profileImage = formData.get('profileImage');

  const user = await User.findOne({ username: username });

  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }

  const newComment = await Comment.create({
    user: user._id,
    comment,
    profileImage,
    pin: id,
  });
  

  return NextResponse.json({ success: true, message: "Comment added successfully" }, { status: 201 });
 } catch (error) {
  console.error(error);
  return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });

 }
}
