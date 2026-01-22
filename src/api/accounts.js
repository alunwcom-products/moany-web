

const BASE_URL = import.meta.env.VITE_API_ENDPOINT;

class UnauthorizedError extends Error { }

//
async function getAccountSummary(token) {
  const response = await fetch(`${BASE_URL}/accountSummary`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new UnauthorizedError();
    }
    throw new Error(); // unknown error
  }

  const data = await response.json();

  const newToken = response.headers.get('x-new-token');
  console.log('RESPONSE: ', newToken);


  return { newToken, results: data.results };
}

// insert/update (PUT) account record supplied as JSON
async function setAccount(account, token) {
  const body = JSON.stringify(account);
  const response = await fetch(`${BASE_URL}/account`, {
    method: "PUT",
    body: body,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new UnauthorizedError();
    }
    throw new Error("Unable to store account.")
  }
}

async function authenticate(username, password) {
  const body = JSON.stringify({ user: username, password: password });
  const response = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    body: body,
    headers: {
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error();
  }
  const data = await response.json();
  console.debug('Login response: ', response.status);
  return data.token;
}

export {
  authenticate,
  getAccountSummary,
  setAccount,
  UnauthorizedError,
}