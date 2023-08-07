import { NextResponse } from "next/server";
import ApiError from "./apiError";
import { Prisma } from "@prisma/client";
import httpStatus from "http-status";



const convertError = (error:Error & any)=>{ 
    if (!(error instanceof ApiError)) {

        let statusCode:number = httpStatus.INTERNAL_SERVER_ERROR

        if(error instanceof Prisma.PrismaClientKnownRequestError){
            statusCode= httpStatus.BAD_REQUEST
        }
         

        
            
        let message: string = ''
    
        switch (error.code) {
            // for duplicate values
            case 'P2002':
                message = `This ${error.meta.target} is already taken`
                error = new ApiError(statusCode, message, true, error.stack);
                break;
            case 'P2025':
                message = ` ${error.meta.cause}`
                error = new ApiError(statusCode, message, true, error.stack)
                break;
            default:
                message = 'database error' || httpStatus[statusCode]

        }
            // this type of errors 
            //Argument id: Got invalid value '1' on prisma.updateOneRankingFactor. Provided String, expected Int.
        if( error instanceof Prisma.PrismaClientValidationError){
           
            error = new ApiError(httpStatus.BAD_REQUEST,'please provide correct data',true,error.stack)
        }


       
    }
    return error
}


export default function errorHandler(err: Error & any|ApiError) {

    
        if (process.env.NODE_ENV === 'development') {
            console.log('----------- inside error handler-------')
            console.log(err)
        }
    err = convertError(err)


    let message =''

    if(err.isOperational){
        message = err.message
    }else{
        message = 'some error occured, please try again'
    }

    let statusCode = err?.statusCode || 500
    let response = {
        message,
        status:'fail',
        errors:err.errors,
        code:statusCode
    } 
    return NextResponse.json(response, {
        status: statusCode
    })


}