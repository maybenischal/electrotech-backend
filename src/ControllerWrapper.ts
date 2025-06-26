/**
 * Higher order function: to wrap errors globally
 */
import { Request, Response, NextFunction } from 'express';

export const controllerWrapper = (
    controller: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
    console.info("Error is being handled by Global Error handler!!")
    return (req: Request, res: Response, next: NextFunction) => {
        controller(req, res, next).catch(next);
    };
};


/**
 * 
 * @param res response sent from controller
 * @param message custom message for frontend
 * @param data data if required
 * @param status status code
 * @returns 
 */
export const sendSuccess = (res: Response, message: string, data?: any, status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data: data ?? null
    });
};

/**
 * 
 * @param res custom error response
 * @param error error 
 * @param status error status code
 * @returns 
 */
export const sendError = (res: Response, error: any, status = 500) => {
    return res.status(status).json({
        success: false,
        message: error.message || 'Something went wrong',
    });
};
