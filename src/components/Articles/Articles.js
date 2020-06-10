import React from "react";
import Article from "./Article/Article";
import classes from "./Articles.module.css";
import { Redirect } from "react-router-dom";
import Pagination from "react-js-pagination";

// this class is used to render all the approved articles
//  Search by title functionality is also implemented here

class Articles extends React.Component {
  render() {
    if (
      localStorage.getItem("api_token") !== null &&
      localStorage.getItem("api_token").slice(0, 5) === "78357"
    ) {
      return <Redirect to="/admin-dashboard" />;
    }
    

    let articles =
      // if the search value is null then render all the
      // approved articles
      this.props.value === null
        ? this.props.article.map((article, id) => {
            let commentCount = 0;
            article.comments.map((comments) => {
              if (comments.is_approved === "Yes") {
                return (commentCount += 1);
              }
              return null;
            });
            if (article.is_approved === "Yes") {
              return (
                <Article
                  key={id}
                  title={article.title}
                  imageName={article.image_name}
                  author={article.author_name}
                  readMore={this.props.readMore}
                  commentsCount={commentCount}
                />
              );
            } else {
              return null;
            }
          })
        : // render only the searched and matching articles
          this.props.article.map((article, id) => {
            let commentCount = 0;
            article.comments.map((comments) => {
              if (comments.is_approved === "Yes") {
                return (commentCount += 1);
              }
              return null;
            });
            // convert article title to lowercase and match it
            // with the search value
            if (
              article.title
                .toLowerCase()
                .search(this.props.value.toLowerCase()) > -1 &&
              article.is_approved === "Yes"
            ) {
              return (
                <Article
                  key={id}
                  title={article.title}
                  imageName={article.image_name}
                  author={article.author_name}
                  readMore={this.props.readMore}
                  commentsCount={commentCount}
                />
              );
            } else {
              return null;
            }
          });

    console.log(this.props.article);
    return (
      <div>
        <h3 className={classes.ArticleStyle}>Popular Articles</h3>
        <hr />
        {this.props.article.length > 0 ? (
          <React.Fragment>
            <div className={classes.Articles}>{articles}</div>
            <br />
            <div className={classes.Pagination}>
              <Pagination
                activePage={this.props.activePage}
                itemsCountPerPage={this.props.itemsCountPerPage}
                totalItemsCount={this.props.totalItemsCount}
                pageRangeDisplayed={2}
                onChange={(pageNumber) => this.props.getUserData(pageNumber)}
                itemClass="page-item"
                linkClass="page-link"
                firstPageText="First"
                lastPageText="Last"
              />
            </div>
          </React.Fragment>
        ) : (
          <h2 className={classes.Empty}>No articles to display</h2>
        )}
      </div>
    );
  }
}

export default Articles;
