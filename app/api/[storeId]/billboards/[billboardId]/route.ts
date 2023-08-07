import ApiError from "@/lib/apiError";
import catchAsync from "@/lib/catchAsync";
import prismadb from "@/lib/prismadb";
import { formattedResponse } from "@/lib/response";
import { billboardSchema } from "@/schemas/schema";
import { ServerComponentProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { z } from "zod";


  export const GET = catchAsync(async (req:Request,{params}:ServerComponentProps<{billboardId:string,storeId:string},null>)=>{
    
    let billboard= await prismadb.billboard.findUnique({
        where:{id:params.billboardId}
    })

    return formattedResponse(billboard,200)
  })

export const PATCH = catchAsync( async (req:Request,{params}:ServerComponentProps<{billboardId:string,storeId:string},null>)=>{
    const body = await req.json() as z.infer< typeof billboardSchema>

    let d = billboardSchema.safeParse(body)
    
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


    const billboard = await prismadb.billboard.updateMany({
        where:{
            id:params.billboardId,
            
        },
        data:{
            label:d.data.label,
            imageUrl:d.data.imageUrl
        }
    })
 return formattedResponse(billboard,200)

})

export const DELETE = catchAsync( async (req:Request,{params}:ServerComponentProps<{storeId:string,billboardId:string},null>)=>{

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

    
    const billboard = await prismadb.billboard.delete({
        where:{
            id:params.billboardId,
          
        }
    })
    
    return formattedResponse('successfully deleted',200)

})

