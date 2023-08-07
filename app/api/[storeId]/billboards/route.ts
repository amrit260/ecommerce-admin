import ApiError from "@/lib/apiError"
import catchAsync from "@/lib/catchAsync"
import prismadb from "@/lib/prismadb"
import { formattedResponse } from "@/lib/response"
import { billboardSchema } from "@/schemas/schema"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { z } from "zod"


export const GET = catchAsync(async (req:Request,{params}:{params:{storeId:string}})=>{

    


    const billboards = await prismadb.billboard.findMany({
      where:{
        storeId:params.storeId
      }
    })

  return formattedResponse(billboards,200)
})
export const POST = catchAsync(async (req:Request,{params}:{params:{storeId:string}})=>{

    
 
        const body = await req.json()
        const data = billboardSchema.safeParse(body)
        if(!data.success){
            throw new ApiError(400,data.error.message)
        }

        const {userId}   = auth();
        if(!userId){
            return new NextResponse('unauthorized',{status:401})
        }

        const storeById = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })

        if(!storeById){
            throw new ApiError(403,'Permission denied')
        }
  

    const billboard = await prismadb.billboard.create({
        data:{
            label:data.data.label,
            imageUrl:data.data.imageUrl,
            storeId:params.storeId
        }
    })

  return formattedResponse(billboard,200)
})