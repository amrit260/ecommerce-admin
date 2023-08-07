import ApiError from "@/lib/apiError"
import catchAsync from "@/lib/catchAsync"
import prismadb from "@/lib/prismadb"
import { formattedResponse } from "@/lib/response"
import {  productSchema } from "@/schemas/schema"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export const GET = catchAsync(async (req:Request,{params}:{params:{storeId:string}})=>{


  const {searchParams} = new URL(req.url)
  
  const categoryId = searchParams.get('categoryId') || undefined;
  const colorId = searchParams.get('colorId') || undefined;
  const sizeId = searchParams.get('sizeId') || undefined;
  const isFeatured = searchParams.get('isFeatured') || undefined;

    const products = await prismadb.product.findMany({
      where:{
        storeId:params.storeId,
        categoryId,
        sizeId,
        isFeatured: isFeatured ? true : undefined
      },
      include:{
        images:true,
        category:true,
        color:true,
        size:true,
      },
      orderBy:{
        createdAt:'desc'
      }
    })

  return formattedResponse(products,200)
})
export const POST = catchAsync(async (req:Request,{params}:{params:{storeId:string}})=>{

    
 
        const body = await req.json()
        const data = productSchema.safeParse(body)
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
  

    const product = await prismadb.product.create({
        data:{
            name:data.data.name,
            price:data.data.price,
            categoryId:data.data.categoryId,
            colorId:data.data.colorId,
            sizeId:data.data.sizeId,
            isFeatured:data.data.isFeatured,
            isArchived:data.data.isArchived,
            storeId:params.storeId,
            images:{
              createMany:{
                data:[...data.data.images.map(image=>image)]
              }
            }
        }
    })

  return formattedResponse(product,200)
})