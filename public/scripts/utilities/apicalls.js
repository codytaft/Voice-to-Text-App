saveDreamToDatabase = async (date, dream) => {
  try {
    const url = window.location.href + `api/v1/dreams`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: date,
        dream: dream
      })
    });
    const newDream = await response.json();
    return await newDream;
  } catch (error) {
    console.log(error);
  }
};

getUserDreams = async userId => {
  try {
    const url = window.location.href + `api/v1/users/${userId}/user_id`;
    const response = await fetch(url);
    const data = await response.json();
    makeWordCloud(data);
    displayDreams(data);
  } catch (error) {
    console.log(error);
  }
};

googleAuthenticate = async id_token => {
  var xhr = await new XMLHttpRequest();
  const authUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`;
  xhr.open('POST', authUrl);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send('idtoken=' + id_token);
  xhr.onload = await async function() {
    let authorized = await authorizeUser(id_token);
    return authorized;
  };
};

authorizeUser = async token => {
  try {
    const url = window.location.href + `api/v1/users/authorize`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token
      })
    });
    const userId = await response.json();
    getUserDreams(userId[0].user_id);
    setCurrentUser(userId[0].user_id);
    return await userId[0].user_id;
  } catch (error) {
    console.log(error);
  }
};

makeWordCloud = dreams => {
  const filteredWords = dreamCounter(dreams);
  let cloudData = {
    type: 'wordcloud',
    options: {
      words: filteredWords
    }
  };
  $(document).ready(function() {
    zingchart.render({
      id: 'myChart',
      data: cloudData,
      height: 200,
      width: '100%'
    });
  });
};

setCurrentUser = async userId => {
  try {
    const url = window.location.href + `api/v1/users/${userId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentUser: true
      })
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

logoutUser = async () => {
  try {
    const url = window.location.href + `api/v1/users`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentUser: false
      })
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

deleteDreamFromDatabase = async dreamId => {
  try {
    const url = window.location.href + `api/v1/dreams/${dreamId}`;
    const response = await fetch(url, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};
