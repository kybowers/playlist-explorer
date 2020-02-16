export default {
  get: (token, url) =>
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: token
      }
    }),
  post: (token, url, data) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: token
      }
    }),
};
