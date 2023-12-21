import { Request, Response, NextFunction } from 'express';


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500;
    let errorMessage = 'Internal Server Error';

    if (err.message === 'CSV_file') {
        statusCode = 400;
        errorMessage = 'Invalid file type. Only CSV files are allowed.';
    } else if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 413; // Request Entity Too Large
        errorMessage = 'File size exceeds the allowed limit.';
    }

    res.status(statusCode).json({ error: errorMessage });
};

