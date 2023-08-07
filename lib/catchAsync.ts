import { NextApiHandler } from "next";
import { NextResponse } from "next/server";
import errorHandler from "./errorHandler";
// import { HandlerType } from "@/types";

const catchAsync = (handler: any) => {

    return async (req: Request,params:any) => {


        return Promise.resolve(handler(req,params)).catch((err) => {

            return errorHandler(err)
        });

    };
}
export default catchAsync