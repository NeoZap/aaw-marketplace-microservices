import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { UnauthenticatedResponse, InternalServerErrorResponse } from "@src/commons/patterns/exceptions";

export const verifyJWTTenant = async (
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

        const verifyResponse = await axios.post(`${authServiceUrl}/api/auth/verify-admin-token`, { token }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (verifyResponse.status !== 200 || !verifyResponse.data?.user) {
            return res.status(401).json(new UnauthenticatedResponse("Invalid admin token").generate());
        }

        req.body.user = verifyResponse.data.user;
        next();

    } catch (error) {
        console.error("Error in verifyJWTTenant:", error);

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