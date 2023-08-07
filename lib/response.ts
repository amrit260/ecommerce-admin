import { NextResponse } from "next/server"

type ResponseFormat = {
    status:string,
    data:object|string|null,
    code:number
} & {
    status:string|null,
    message:string,
    code:number
}

export const formattedResponse = (data:object|string|null,code:number)=>{
return NextResponse.json({success:code<400?true:false,[typeof(data)==='string'?'message':'data']:data,},{status:code})
}