import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { UnauthenticatedResponse, InternalServerErrorResponse, UnauthorizedResponse, NotFoundResponse } from "@src/commons/patterns/exceptions";

export const verifyJWTProduct = async (
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
    const user = verifyResponse.data.user;

    const tenantServiceUrl = process.env.TENANT_MS_URL || "http://localhost:8003";

    const tenantResponse = await axios.get(`${tenantServiceUrl}/api/tenant/${process.env.TENANT_ID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (tenantResponse.status !== 200 || !tenantResponse.data?.tenants) {
      return res.status(404).json(new NotFoundResponse("Tenant not found").generate());
    }

    const tenant = tenantResponse.data.tenants;

    if (user.id !== tenant.owner_id) {
      return res.status(403).json(new UnauthorizedResponse("User is not the tenant owner").generate());
    }

    req.body.user = user;
    next();
  } catch (error) {
    console.error("Error in verifyJWTProduct:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        return res.status(error.response.status).json(new UnauthenticatedResponse(error.response.data?.message || "Invalid token").generate());
      } else {
        return res.status(500).json(new InternalServerErrorResponse("Other microservice unavailable").generate());
      }
    }

    return res.status(500).json(new InternalServerErrorResponse().generate());
  }
};