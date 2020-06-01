import React from "react";
import "./App.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import About from "../components/About/About";
import Contact from "../components/Contact/Contact";
import { Route, Switch, withRouter } from "react-router-dom";
import Articles from "../components/Articles/Articles";
import { Container } from "react-bootstrap";
import WriteArticle from "../components/WriteArticle/WriteArticle";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import ReadMore from "../components/ReadMore/ReadMore";
import axios from "axios";
import AdminDashboard from "../components/Dashboard/AdminDashboard/AdminDashboard";
import UserDashboard from "../components/Dashboard/UserDashboard/UserDashboard";

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: null,
      readMoreUrl: "",
      article: [],
      isrender: false,
    };
  }

  componentDidMount() {
    axios.get("http://127.0.0.1:8000/api/article").then((response) => {
      console.log(response.data);
      this.setState({ article: [...response.data], isrender: true });
    });
  }

  searchValueHandler = (event) => {
    this.setState({
      searchValue: event.target.value,
    });
  };

  readMoreUrlHandler = () => {
    this.setState({
      readMoreUrl: this.props.location.pathname,
    });
  };

  render() {
    if (!this.state.isrender) {
      return <div className="loader">Loading...</div>;
    }
    let readMore = this.state.article.map((article) => {
      if (
        this.props.location.pathname.replace("/", "").split("-").join(" ") ===
        article.title.toLowerCase()
      ) {
        return article;
      }
      return null;
    });

    return (
      <div>
        <Header
          blurred={this.searchValueHandler}
          display={this.props.location.pathname === "/" ? "block" : "none"}
        />
        <Container className="Container">
          <Switch>
            <Route exact path="/">
              <Articles
                value={this.state.searchValue}
                readMore={this.readMoreUrlHandler}
                article={this.state.article}
              />
            </Route>

            <Route exact path="/write-article">
              <WriteArticle />
            </Route>
            <Route exact path="/admin-dashboard">
              <AdminDashboard />
            </Route>
            <Route exact path="/user-dashboard">
              <UserDashboard />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/about">
              <About />
            </Route>
            <Route exact path="/contact">
              <Contact />
            </Route>
            <Route exact path={this.state.readMoreUrl}>
              <ReadMore article={readMore} />
            </Route>
          </Switch>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);
