import connectToDB from "../../../libs/mongodb"
import Pin from "../../../models/pins"
import cloudinary from "../../../libs/cloudinary"
import { NextResponse } from "next/server"

export const POST = async (req) => {
 connectToDB();

 const formData = await req.formData();

 const image = formData.get('image');
 const user = formData.get('user');
 const title = formData.get('title');
 const description = formData.get('description');
 const tags = formData.get('tags');

 const tagsArray = tags.split(',').map(tag => tag.trim());

 if (!image) {
  return NextResponse.json({ error: "No File Received." }, { status: 400 });
 }

 try {
  const arrayBuffer = await image.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const uploadedResponse = await new Promise((resolve, reject) => {
   cloudinary.uploader.upload_stream({}, function (error, result) {
    if (error) reject(error);
    resolve(result);
   }).end(buffer);
  });

  const pin = await Pin.create({
   user,
   title,
   image: { url: uploadedResponse.secure_url },
   description,
   tags: tagsArray,
 });

 return NextResponse.json({
   success: true,
   message: "Pin posted successfully",
   pin, 
 }, { status: 201 });
 } catch (error) {
  console.log("Error in pins route", error);
  return NextResponse.json({
   success: false,
   message: error.message,
  }, { status: 500 });
 }
}

export const GET = async (req) => {
  connectToDB();
  const search = req.nextUrl.searchParams.get('search');

  let pins;

  if (search) {
    pins = await Pin.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ],
    });
  }
  else {
    pins = await Pin.find({});
  }

  return NextResponse.json({ 
    success: true,
    pins,
  }, { status: 200 });
}
