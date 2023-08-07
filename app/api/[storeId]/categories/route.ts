import ApiError from "@/lib/apiError"
import catchAsync from "@/lib/catchAsync"
import prismadb from "@/lib/prismadb"
import { formattedResponse } from "@/lib/response"
import { billboardSchema, categorySchema } from "@/schemas/schema"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { z } from "zod"


export const GET = catchAsync(async (req:Request,{params}:{params:{storeId:string}})=>{

    


    const categories = await prismadb.category.findMany({
      where:{
        storeId:params.storeId
      }
    })

  return formattedResponse(categories,200)
})
export const POST = catchAsync(async (req:Request,{params}:{params:{storeId:string}})=>{

    
 
        const body = await req.json()
        const data = categorySchema.safeParse(body)
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
  

    const category = await prismadb.category.create({
        data:{
            name:data.data.name,
            billboardId:data.data.billboardId,
            storeId:params.storeId
        }
    })

  return formattedResponse(category,200)
})