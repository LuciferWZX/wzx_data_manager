import jwtDecode from 'jwt-decode';

const parseToken = (token: string): { id: number } => {
  const data: { id: number } = jwtDecode(token);
  return data;
};
export default parseToken;
