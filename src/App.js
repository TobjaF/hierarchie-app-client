import logo from './logo.svg';
import './App.css';
import React from 'react';

class Treenode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hierarchy: props.hierarchy
    };
  }
  render() {
    const hierarchy = this.state.hierarchy;
    if (hierarchy.children.length === 0) {
      return (
        <li> {hierarchy.name}</li>
      );
    } else {
      return (
        <li> <span>{hierarchy.name}</span>
          <ul>
            {hierarchy.children.map((item, index) => (
              <Treenode hierarchy={item} key={index}>
              </Treenode>
            ))}
          </ul>
        </li>
      );
    }
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      hierarchy: { "children": [] }//mockhierarchy
    };
  }

  componentDidMount() {
    //"proxy": "http://localhost:3001", //für ins package.json, dann nur "/hierarchy" als url
    fetch("http://localhost:3001/hierarchy", {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => {
        try {
          return res.json()
        } catch (error) {
          console.log('fehler', error)
        }
      })
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            hierarchy: result,
            error: null
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error: error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, hierarchy } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <Treenode hierarchy={hierarchy}></Treenode>
      );
    }
  }
}

export default App;
