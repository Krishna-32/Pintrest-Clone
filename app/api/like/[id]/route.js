import connectToDB from "../../../../libs/mongodb";
import Pin from "../../../../models/pins";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";


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

     const userLikedIndex = pin.likes.findIndex((like) => like.user === token.name);

     if (userLikedIndex > -1) {
      pin.likes.splice(userLikedIndex, 1);
      await pin.save();
      return NextResponse.json({ success: true, message: "Pin unliked successfully", pin }, { status: 200 });
     } else {
      const newLike = {
       user: token.name,
      }
      pin.likes.push(newLike);
      await pin.save();
      return NextResponse.json({ success: true, message: "Pin liked successfully", pin }, { status: 201 });
     }

    } catch (error) {
     return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
