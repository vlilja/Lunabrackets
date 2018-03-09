let baseUrl;

if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://ec2-54-154-60-207.eu-west-1.compute.amazonaws.com:3001/api/';
} else {
  baseUrl = 'https://localhost:3001/api/';
}
export default {

  baseUrl,

};
