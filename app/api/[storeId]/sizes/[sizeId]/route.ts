import ApiError from "@/lib/apiError";
import catchAsync from "@/lib/catchAsync";
import prismadb from "@/lib/prismadb";
import { formattedResponse } from "@/lib/response";
import { sizeSchema } from "@/schemas/schema";
import { ServerComponentProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { z } from "zod";


  export const GET = catchAsync(async (req:Request,{params}:ServerComponentProps<{sizeId:string,storeId:string},null>)=>{
    
    let size= await prismadb.size.findUnique({
        where:{id:params.sizeId}
    })

    return formattedResponse(size,200)
  })

export const PATCH = catchAsync( async (req:Request,{params}:ServerComponentProps<{sizeId:string,storeId:string},null>)=>{
    const body = await req.json() as z.infer< typeof sizeSchema>

    let d = sizeSchema.safeParse(body)
    
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


    const size = await prismadb.size.updateMany({
        where:{
            id:params.sizeId,
            
        },
        data:{
            name:d.data.name,
            value:d.data.value
        }
    })
 return formattedResponse(size,200)

})

export const DELETE = catchAsync( async (req:Request,{params}:ServerComponentProps<{storeId:string,sizeId:string},null>)=>{

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

    
await prismadb.size.delete({
        where:{
            id:params.sizeId,
          
        }
    })
    
    return formattedResponse('successfully deleted',200)

})

