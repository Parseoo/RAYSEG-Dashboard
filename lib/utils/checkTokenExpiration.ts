/**
 * Decodifica un JWT y verifica si ha expirado
 * @param token - JWT token a validar
 * @returns true si el token ha expirado o es inválido, false si aún es válido
 */
export const isTokenExpired = (token: string): boolean => {
    try {
        // Decodificar el payload del JWT (segunda parte del token)
        const payload = JSON.parse(atob(token.split('.')[1]));

        // El campo 'exp' en JWT está en segundos, convertimos a milisegundos
        const expirationTime = payload.exp * 1000;

        // Comparar con la hora actual
        return Date.now() >= expirationTime;
    } catch (error) {
        // Si hay error al decodificar, consideramos el token como inválido
        console.error('Error decoding token:', error);
        return true;
    }
};

/**
 * Obtiene el tiempo restante antes de que expire el token (en milisegundos)
 * @param token - JWT token
 * @returns milisegundos hasta la expiración, o 0 si ya expiró
 */
export const getTokenTimeRemaining = (token: string): number => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const timeRemaining = expirationTime - Date.now();
        return timeRemaining > 0 ? timeRemaining : 0;
    } catch (error) {
        return 0;
    }
};
