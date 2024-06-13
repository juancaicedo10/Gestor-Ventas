import { jwtDecode } from 'jwt-decode';

const jwt = jwtDecode;
export default function decodeToken(): any {
    try {
        interface MyToken {
            user: Object;            // whatever else is in the JWT.
          }
          const token = localStorage.getItem('token');
          const decodedToken = jwt(token || '') as MyToken;
        const user = decodedToken;
        return {
            user: user
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}