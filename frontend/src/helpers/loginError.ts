export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "object" && error !== null && "message" in error) {
        const err = error as Record<string, any>;
        if (typeof err.message === "string") {
            return err.message;
        }
        if (typeof err.message === "object" && err.message !== null && "message" in err.message) {
            return err.message.message;
        }
        return String(err.message);
    }

    return "Ocurrió un error al iniciar sesión.";
}