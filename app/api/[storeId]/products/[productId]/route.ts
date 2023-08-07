import ApiError from "@/lib/apiError";
import catchAsync from "@/lib/catchAsync";
import prismadb from "@/lib/prismadb";
import { formattedResponse } from "@/lib/response";
import { productSchema } from "@/schemas/schema";
import { ServerComponentProps } from "@/types";
import { auth } from "@clerk/nextjs";
import { z } from "zod";


  export const GET = catchAsync(async (req:Request,{params}:ServerComponentProps<{productId:string,storeId:string},null>)=>{
    
    let product= await prismadb.product.findUnique({
        where:{id:params.productId},
        include:{
            images:true,
            category:true,
            color:true,
            size:true,
          },
    })

    return formattedResponse(product,200)
  })

export const PATCH = catchAsync( async (req:Request,{params}:ServerComponentProps<{productId:string,storeId:string},null>)=>{
    const body = await req.json() as z.infer< typeof productSchema>

    let d = productSchema.safeParse(body)
    
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


    await prismadb.product.update({
        where:{
            id:params.productId,
            
        },
        data:{
            name:d.data.name,
            price:d.data.price,
            categoryId:d.data.categoryId,
            colorId:d.data.colorId,
            sizeId:d.data.sizeId,
            isFeatured:d.data.isFeatured,
            isArchived:d.data.isArchived,
            images:{
             deleteMany:{}
            }
        }
    })

    const product = await prismadb.product.update({
        where:{
            id:params.productId
        },
        data:{
            images:{
                createMany:{
                    data:[...d.data.images.map(image=>image)]

                }
            }
        }
    })

 return formattedResponse(product,200)

})

export const DELETE = catchAsync( async (req:Request,{params}:ServerComponentProps<{storeId:string,productId:string},null>)=>{

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

    
   await prismadb.product.delete({
        where:{
            id:params.productId,
          
        }
    })
    
    return formattedResponse('successfully deleted',200)

})

