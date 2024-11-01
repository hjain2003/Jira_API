import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/api/myself', async (req, res) => {
  const { email, token } = req.query;

  try {
    const response = await fetch('https://harshjainn2003.atlassian.net/rest/api/3/myself', {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error fetching Jira data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/issues/assigned', async (req, res) => {
  const { email, token } = req.query;

  try {
    const response = await fetch(`https://harshjainn2003.atlassian.net/rest/api/3/search?jql=assignee=currentUser()`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      res.json({ issues: data.issues });
    } else {
      res.status(response.status).json({ message: 'Error fetching assigned issues' });
    }
  } catch (error) {
    console.error('Error fetching assigned issues:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/issues/created', async (req, res) => {
  const { email, token } = req.query;

  try {
    const response = await fetch(`https://harshjainn2003.atlassian.net/rest/api/3/search?jql=creator=currentUser()`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      res.json({ issues: data.issues });
    } else {
      res.status(response.status).json({ message: 'Error fetching created issues' });
    }
  } catch (error) {
    console.error('Error fetching created issues:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
