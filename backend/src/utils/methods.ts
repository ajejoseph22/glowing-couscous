import {SuccessResponse} from "../types/success-response";
import ErrorResponse from "../types/error-response";

export const successResponse = (
    data: any
): SuccessResponse => {
    return {
        success: true,
        data,
    };
};

export const errorResponse = (
    message: string,
): ErrorResponse => ({
    message,
    success: false,
    data: null,
});