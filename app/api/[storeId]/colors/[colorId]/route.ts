import ApiError from "@/lib/apiError";
import catchAsync from "@/lib/catchAsync";
import prismadb from "@/lib/prismadb";
import { formattedResponse } from "@/lib/response";
import { colorSchema } from "@/schemas/schema";
import { ServerComponentProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { z } from "zod";


  export const GET = catchAsync(async (req:Request,{params}:ServerComponentProps<{colorId:string,storeId:string},null>)=>{
    
    let color= await prismadb.color.findUnique({
        where:{id:params.colorId}
    })

    return formattedResponse(color,200)
  })

export const PATCH = catchAsync( async (req:Request,{params}:ServerComponentProps<{colorId:string,storeId:string},null>)=>{
    const body = await req.json() as z.infer< typeof colorSchema>

    let d = colorSchema.safeParse(body)
    
    if(!d.success){ 
        throw new ApiError(400,d.error.message)
    }

    const {userId} = auth();

    if(!userId){
        throw new ApiError(401,'unauthenticated')
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

    console.log(d)


    const color = await prismadb.color.update({
        where:{
            id:params.colorId,
            
        },
        data:{
            name:d.data.name,
            value:d.data.value
        }
    })
 return formattedResponse(color,200)

})

export const DELETE = catchAsync( async (req:Request,{params}:ServerComponentProps<{storeId:string,colorId:string},null>)=>{

    const {userId} = auth();

    if(!userId){
        throw new ApiError(401,'unauthenticated')
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

    
await prismadb.color.delete({
        where:{
            id:params.colorId,
          
        }
    })
    
    return formattedResponse('successfully deleted',200)

})

