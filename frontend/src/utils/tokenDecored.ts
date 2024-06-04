import { jwtDecode } from 'jwt-decode';

const jwt = jwtDecode;
export default function decodeToken(): any {
    try {
        interface MyToken {
            user: Object;
            role: string;
            // whatever else is in the JWT.
          }
          const token = localStorage.getItem('token');
          const decodedToken = jwt(token || '') as MyToken;
        const role = decodedToken.role;
        const user = decodedToken.user;
        return {
            role: role,
            user: user
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}