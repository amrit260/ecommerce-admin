import ApiError from "@/lib/apiError";
import catchAsync from "@/lib/catchAsync";
import prismadb from "@/lib/prismadb";
import { formattedResponse } from "@/lib/response";
import { ServerComponentProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1),
  });
  

export const PATCH = catchAsync( async (req:Request,{params}:ServerComponentProps<{storeId:string},null>)=>{
    const body = await req.json() as z.infer< typeof formSchema>

    let d = formSchema.safeParse(body)
    
    if(!d.success){ 
        throw new ApiError(400,d.error.message)
    }

    const {userId} = auth();

    if(!userId){
        throw new ApiError(401,'unauthenticated')
    }

    
    
    const store = await prismadb.store.updateMany({
        where:{
            id:params.storeId,
            userId
        },
        data:{
            name:d.data.name
        }
    })
    
    return formattedResponse(store,200)

})

export const DELETE = catchAsync( async (req:Request,{params}:ServerComponentProps<{storeId:string},null>)=>{

    const {userId} = auth();

    if(!userId){
        throw new ApiError(401,'unauthenticated')
    }

    
    
    const store = await prismadb.store.deleteMany({
        where:{
            id:params.storeId,
            userId
        }
    })
    
    return formattedResponse('update successful',200)

})

