import React from "react";
import "./App.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Route, Switch, withRouter } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import routeList from "../Routes/Routes";

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
      .get(`/article?page=${pageNumber}`)
      .then((response) => {
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

    const data = {
      value: this.state.searchValue,
      article: this.state.article,
      activePage: this.state.activePage,
      itemsCountPerPage: this.state.itemsCountPerPage,
      totalItemsCount: this.state.totalItemsCount,
      getUserData: this.getUserData,
      readMore: readMore,
    };

    let routesLink = routeList(data).map((route, id) => {
      return (
        <Route key={id} exact path={route.path}>
          {route.component}
        </Route>
      );
    });

    return (
      <div>
        <Header
          blurred={this.searchValueHandler}
          display={this.props.location.pathname === "/" ? "block" : "none"}
        />
        <Container className="Container">
          <Switch>{routesLink}</Switch>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);
