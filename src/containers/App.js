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
import ArticleList from "../components/ArticleList/ArticleList";
import Comments from "../components/Dashboard/AdminDashboard/Comments/Comments";

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: null,
      readMoreUrl: "",
      article: [],
      isrender: false,
      users: [],
      activePage: 1,
      itemsCountPerPage: 1,
      totalItemsCount: 1,
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData = (pageNumber = 1) => {
    axios
      .get(`http://127.0.0.1:8000/api/article?page=${pageNumber}`)
      .then((response) => {
        console.log(response.data);
        this.setState({
          article: [...response.data.articles.data],
          activePage: response.data.articles.current_page,
          itemsCountPerPage: response.data.articles.per_page,
          totalItemsCount: response.data.articles.total,
          isrender: true,
          users: [...response.data.users.data],
        });
      });
  };

  searchValueHandler = (event) => {
    this.setState({
      searchValue: event.target.value,
    });
  };

  render() {
    if (!this.state.isrender) {
      return <div className="loader">Loading...</div>;
    }

    let readMore = this.props.location.pathname
      .replace("/", "")
      .split("-")
      .join(" ");

    console.log(readMore);

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
                article={this.state.article}
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.itemsCountPerPage}
                totalItemsCount={this.state.totalItemsCount}
                getUserData={this.getUserData}
              />
            </Route>

            {/* done  */}
            <Route exact path="/write-article">
              <WriteArticle />
            </Route>
            {/* done  */}
            <Route exact path="/article-list">
              <ArticleList />
            </Route>
            <Route exact path="/admin-dashboard">
              <AdminDashboard />
            </Route>
            <Route exact path="/comments">
              <Comments articles={this.state.article} />
            </Route>
            {/* done  */}
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
            {/* done  */}
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
