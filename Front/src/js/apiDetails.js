let baseUrl;
console.log(process.argv);
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://lunabrackets.com:3001/api/';
} else {
  baseUrl = 'https://localhost:3001/api/';
}

export default {

  baseUrl,

};
