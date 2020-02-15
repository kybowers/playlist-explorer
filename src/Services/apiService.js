const userAuth = {}

export default {
    get: url =>  fetch(url, { 
        method: 'GET', 
        headers: {
            'Authorization': userAuth['access_token'],
        }
    }),
    post: (url, data) =>  fetch(url, { 
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Authorization': userAuth['access_token']
        }
    }),
    updateAuth: (accessToken) => {
        userAuth['access_token'] = 'Bearer ' + accessToken;
    },
};
