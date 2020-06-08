import React from "react";
import Categories from "./Categories/Categories";

class ArticleList extends React.Component {
  render() {
    let articleCategories = {};
    this.props.article.map((article) => {
      if (article.is_approved === "Yes") {
        return article.category.map((categoryArray) => {
          if (categoryArray.category in articleCategories) {
            return articleCategories[categoryArray.category].push(
              article.title
            );
          } else {
            articleCategories[categoryArray.category] = [];
            return articleCategories[categoryArray.category].push(
              article.title
            );
          }
        });
      }
      return null;
    });
    console.log(articleCategories);
    const cat = Object.keys(articleCategories).map((cat, id) => {
      let title = articleCategories[cat];
      return <Categories key={id} category={cat} title={title} />;
    });
    return <div>{cat}</div>;
  }
}

export default ArticleList;
