import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { UnauthenticatedResponse, InternalServerErrorResponse } from "@src/commons/patterns/exceptions";

export const verifyJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json(new UnauthenticatedResponse("No token provided").generate());
        }

        const authServiceUrl = process.env.AUTH_MS_URL || "http://localhost:8000";
        const verifyResponse = await axios.post(`${authServiceUrl}/api/auth/verify-token`, { token });

        if (verifyResponse.status !== 200 || !verifyResponse.data?.user) {
            return res.status(401).json(new UnauthenticatedResponse("Invalid token").generate());
        }

        const user = verifyResponse.data.user;

        const SERVER_TENANT_ID = process.env.TENANT_ID;
        console.log("SERVER_TENANT_ID", SERVER_TENANT_ID);
        console.log("user.tenant_id", user.tenant_id);
        if (SERVER_TENANT_ID && verifyResponse.data.tenant_id !== SERVER_TENANT_ID) {
            return res.status(401).json(new UnauthenticatedResponse("Invalid tenant").generate());
        }

        req.body.user = user;
        next();

    } catch (error) {
        console.error("Error in verifyJWT:", error);

        if (axios.isAxiosError(error)) {
            if (error.response) {
                return res.status(error.response.status).json(new UnauthenticatedResponse(error.response.data?.message || "Invalid token").generate());
            } else {
                return res.status(500).json(new InternalServerErrorResponse("Other microservice unavailable").generate());
            }

        }
        return res.status(401).json(new UnauthenticatedResponse("Invalid token").generate());
    }
};