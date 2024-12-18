import connectToDB from "../../../../libs/mongodb"
import Pin from "../../../../models/pins"
import { NextResponse } from "next/server"

export const GET = async (req, { params }) => {
   try {
    await connectToDB();
     const { id } = await params;
     const pin = await Pin.findById(id);
     if (!pin) {
      return NextResponse.json({ success: false, error: "Pin not found" }, { status: 404 });
     }
     return NextResponse.json({ success: true, pin });
   } catch (error) {
    return NextResponse.json({ success: false, error: "Error fetching pin" }, { status: 500 });
   }
}
