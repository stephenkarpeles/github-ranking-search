import React, { useState } from "react";
import axios from "axios";
import { Button, Col, Container, Form, List, ListGroup, Row } from 'react-bootstrap'
import './bootstrap.min.css';
import './App.css';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');
  const [githubUser, setGithubUser] = useState('');
  const [repos, setRepos] = useState([]);

  const searchGithubUser = async (user) => {
    const response = await axios
      .get(`https://api.github.com/users/${user}`)
      .catch((err) => console.log(err));
      
    if (response) {
      setGithubUser(response.data); 
      setLoading(true);     

      await Promise.allSettled([
        axios.get(`https://api.github.com/users/${user}/repos?per_page=9999`,),
      ])
        .then((results) => {
          const [repos] = results;
          const fulfilledStatus = 'fulfilled';

          if (repos.status === fulfilledStatus) {
            setRepos(repos.value.data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log('No such user');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user) {
      searchGithubUser(user);
    }
    console.log(user);
  };

  const sortedRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);

  return (
    <div className="App">
      <Container>

        <Row className="justify-content-md-center">
          <Col lg={8}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formSearch">
                <Form.Control
                  type='text'
                  placeholder='Search Github username...'
                  value={user}
                  onChange={(e) => {
                    setUser(e.target.value);
                  }}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Search
              </Button>
            </Form>
          </Col>
        </Row>

        <Row className="mt-5 justify-content-md-center">
          <Col lg={8}>
            <ListGroup>
              {loading && 
                sortedRepos.map((repo) => (
                  <ListGroup.Item key={repo.id}>
                    <div>
                      Stargazer Count: <strong>{repo.stargazers_count}</strong>
                    </div>
                    <div>
                      Name of Repo: <strong>{repo.name}</strong>
                    </div>
                  </ListGroup.Item>
                ))
              }
            </ListGroup>
          </Col>
        </Row>

      </Container>
    </div>  
  )
}

export default App