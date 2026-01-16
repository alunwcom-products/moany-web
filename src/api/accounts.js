

const BASE_URL = import.meta.env.VITE_API_ENDPOINT;

//
async function getAccountSummary(token) {
  // try {
  const response = await fetch(`${BASE_URL}/accountSummary`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  //console.debug(data);
  if (!response.ok) {
    throw new Error("Failed to fetch accounts.")
  }
  return data.results;
  // } catch (error) {
  //setError({ message: error.message || 'Unknown error occurred.' });
  // throw new Error('Error fetching account summary: ');
  // }
}

// insert/update (PUT) account record supplied as JSON
async function setAccount(account, token) {
  try {
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
      throw new Error("Unable to store account.")
    }
  } catch (error) {
    //setError({ message: error.message || 'Unknown error occurred.' });
    throw new Error('Error storing account: ');
  }
}

async function authenticate(username, password) {
  try {
    const body = JSON.stringify({ user: username, password: password });
    const response = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      body: body,
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    console.debug('Login response: ', response.status);
    if (!response.ok) {
      throw new Error("Authentication failed.")
    }
    console.debug(data);
    return data.token;
  } catch (error) {
    //console.error(error);
    //setError({ message: error.message || 'Unknown error occurred.' });
    //onLoginChange({});
    throw error;
  }
}

export {
  authenticate,
  getAccountSummary,
  setAccount,
}