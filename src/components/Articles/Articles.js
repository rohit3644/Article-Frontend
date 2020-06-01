import React from "react";
import Article from "./Article/Article";
import classes from "./Articles.module.css";
import { Redirect } from "react-router-dom";

class Articles extends React.Component {
  render() {
    if (
      localStorage.getItem("api_token") !== null &&
      localStorage.getItem("is_admin") === "Yes"
    ) {
      return <Redirect to="/admin-dashboard" />;
    }

    let articles =
      this.props.value === null
        ? this.props.article.map((article, id) => {
            if (article.is_approved === "Yes") {
              return (
                <Article
                  key={id}
                  title={article.title}
                  imageName={article.image_name}
                  author={article.author_name}
                  readMore={this.props.readMore}
                />
              );
            } else {
              return null;
            }
          })
        : this.props.article.map((article, id) => {
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
        <div className={classes.Articles}>{articles}</div>
      </div>
    );
  }
}

export default Articles;
