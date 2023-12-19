class AppError extends Error {
    name: string;
    message: string;
    explanation: string;
    statusCode: number;

    constructor(
        name: string,
        message: string,
        explanation: string,
        statusCode: number
    ) {
        super();
        this.name = name;
        this.message = message;
        this.explanation = explanation;
        this.statusCode = statusCode;
    }
}

export default AppError;
