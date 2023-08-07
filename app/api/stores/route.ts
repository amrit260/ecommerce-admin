import prismadb from "@/lib/prismadb"
import { formattedResponse } from "@/lib/response"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export const POST = async (req:Request)=>{

    
    try {
        const body = await req.json()
        const {name} = body
        const {userId}   = auth();
        if(!userId){
            return new NextResponse('unauthorized',{status:401})
        }

    if (!name){
        return new NextResponse('Name is required',{status:400})
    }

    const store = await prismadb.store.create({
        data:{
            name,
            userId
        }
    })
  return formattedResponse(store,200)
    }
    catch(error){
        console.log(error)

        return new NextResponse('internal error',{status:500})
    }

  

}