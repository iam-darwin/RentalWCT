import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500;
    let errorMessage = 'Internal  server error';

    if (err.message === 'CSV_file') {
        statusCode = 400;
        errorMessage = 'Invalid file type. Only CSV files are allowed.';
    } else if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 413; 
        errorMessage = 'File size exceeds the allowed limit.';
    }else if(err.message="Message_NOT_SENT"){
        statusCode=httpStatus.INTERNAL_SERVER_ERROR
        errorMessage="Message Not sent to driver"
    }

    res.status(statusCode).json({ error: errorMessage });
};

