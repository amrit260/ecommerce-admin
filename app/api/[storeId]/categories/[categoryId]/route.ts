import ApiError from "@/lib/apiError";
import catchAsync from "@/lib/catchAsync";
import prismadb from "@/lib/prismadb";
import { formattedResponse } from "@/lib/response";
import { categorySchema } from "@/schemas/schema";
import { ServerComponentProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { z } from "zod";


  export const GET = catchAsync(async (req:Request,{params}:ServerComponentProps<{categoryId:string,storeId:string},null>)=>{
    
    let category= await prismadb.category.findUnique({
        where:{id:params.categoryId},
        include:{
            billboard:true
        }
        
    })

    return formattedResponse(category,200)
  })

export const PATCH = catchAsync( async (req:Request,{params}:ServerComponentProps<{categoryId:string,storeId:string},null>)=>{
    const body = await req.json() as z.infer< typeof categorySchema>

    let d = categorySchema.safeParse(body)
    
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


    const category = await prismadb.category.updateMany({
        where:{
            id:params.categoryId,
            
        },
        data:{
            name:d.data.name,
            billboardId:d.data.billboardId
            
        }
    })
 return formattedResponse(category,200)

})

export const DELETE = catchAsync( async (req:Request,{params}:ServerComponentProps<{storeId:string,categoryId:string},null>)=>{

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

    
   await prismadb.category.delete({
        where:{
            id:params.categoryId,
          
        }
    })
    
    return formattedResponse('successfully deleted',200)

})

