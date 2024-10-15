const request = async (url, options) => {
  options.credentials = 'include';  // Ensures HttpOnly cookies are sent with the request
  const response = await fetch(url, options);
  const body = await response.json();
  return { response: response, body: body };
};

export const patch = async (url, body, headers = {}) => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  };
  return await request(url, options);
};

export const del = async (url, headers = {}) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  return await request(url, options);
};

export const get = async (url, headers = {}) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  return await request(url, options);
};

export const post = async (url, body, headers = {}) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  };
  return await request(url, options);
};
