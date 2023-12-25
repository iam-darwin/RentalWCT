class ServiceError extends Error {
    name: string;
    message: string;
    statusCode: number;

    constructor(
        name: string,
        message: string,
        statusCode: number
    ) {
        super();
        this.name = name;
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default ServiceError;
