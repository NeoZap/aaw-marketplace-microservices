import { InternalServerErrorResponse, UnauthorizedResponse } from "@src/commons/patterns";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getUserById } from "../dao/getUserById.dao";

export const verifyAdminTokenService = async (
    token: string
) => {
    try {
        console.log("[verifyAdminTokenService] token: ", token);
        const payload = jwt.verify(
            token,
            process.env.ADMIN_JWT_SECRET as string
        ) as JwtPayload;

        console.log("[verifyAdminTokenService] payload: ", payload);

        const { id, tenant_id } = payload;
        const SERVER_TENANT_ID = process.env.ADMIN_TENANT_ID;
        if (!SERVER_TENANT_ID) {
            return new InternalServerErrorResponse("Server tenant ID is missing").generate();
        }
        console.log("[verifyAdminTokenService] SERVER_TENANT_ID: ", SERVER_TENANT_ID);
        console.log("[verifyAdminTokenService] tenant_id: ", tenant_id);
        if (tenant_id !== SERVER_TENANT_ID) {
            return new UnauthorizedResponse("Invalid token").generate();
        }

        const user = await getUserById(id, SERVER_TENANT_ID);
        console.log("[verifyAdminTokenService] user: ", user);
        if (!user) {
            return new UnauthorizedResponse("Invalid token").generate();
        }

        return {
            data: {
                user,
            },
            status: 200
        }
    } catch (err: any) {
        return new UnauthorizedResponse("Invalid token").generate();
    }
}