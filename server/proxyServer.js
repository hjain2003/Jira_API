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

app.get('/api/user/search', async (req, res) => {
  const { query, email, token } = req.query;

  try {
    const response = await fetch(`https://harshjainn2003.atlassian.net/rest/api/3/user/search?query=${query}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      res.json({ accountId: data[0].accountId });
    } else {
      res.status(response.status).json({ message: 'Error fetching user data' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/issues/create', async (req, res) => {
  console.log("Received issue creation request:", req.body);
  const { email, token } = req.query;
  const issueData = req.body;

  try {
    const response = await fetch(`https://harshjainn2003.atlassian.net/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issueData),
    });

    if (response.ok) {
      const data = await response.json();
      res.status(200).json(data);
    } else {
      const errorData = await response.json(); // Get the full error response from Jira
      console.error('Error creating issue:', errorData);
      res.status(response.status).json({
        message: 'Failed to create issue',
        error: errorData, // Forward the Jira error details to the client
      });
    }
  } catch (error) {
    console.error('Server error while creating issue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/issues/update/:issueId', async (req, res) => {
  const { email, token } = req.query;
  const issueId = req.params.issueId;
  const transitionData = req.body;

  try {
      const response = await fetch(`https://harshjainn2003.atlassian.net/rest/api/3/issue/${issueId}/transitions`, {
          method: 'POST',
          headers: {
              'Authorization': `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(transitionData),
      });

      if (response.ok) {
          const data = await response.json();
          res.status(200).json(data);
      } else {
          const errorData = await response.json();
          console.error('Error updating issue status:', errorData);
          res.status(response.status).json({
              message: 'Failed to update issue status',
              error: errorData,
          });
      }
  } catch (error) {
      console.error('Server error while updating issue status:', error);
      res.status(500).json({ message: 'Server error' });
  }
});



app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
