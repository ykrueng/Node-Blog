import React from "react";
import { Segment, Header, Loader, Card } from "semantic-ui-react";
import axios from "axios";

class App extends React.Component {
  state = {
    users: [],
    loading: false,
    error: false
  };

  componentDidMount() {
    this.setState({ loading: true, error: false });

    axios
      .get("http://localhost:5000/api/users/")
      .then(res => {
        this.setState({
          loading: false,
          error: false,
          users: res.data
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: true
        });
      });
  }

  render() {
    const { users, error, loading } = this.state;
    return (
      <Segment style={{border: "none", boxShadow: "none"}}>
        <Header textAlign="center" as="h1">
          Node Blog
        </Header>
        <Segment style={{
          maxWidth: "800px",
          textAlign: "center",
          margin: "0 auto"
        }}>
          {error && <p>Failed to Fetch Users</p>}
          {loading && <Loader active inline="centered" />}
          {users &&
            <Card.Group itemsPerRow={2} textAlign="center">
            {
              users.map(user => (
                <Card color="violet" key={user.id}>
                  <Card.Content>
                    <Card.Header>{user.name}</Card.Header>
                  </Card.Content>
                </Card>
              ))
            }
            </Card.Group>
          }
        </Segment>
      </Segment>
    );
  }
}

export default App;
