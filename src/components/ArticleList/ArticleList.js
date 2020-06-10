import React from "react";
import Categories from "./Categories/Categories";
import axios from "axios";
// this class iterates through the articles and categories and
// creates an object with categories as keys and article titles
// as values and finally calls the categories component

class ArticleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
    };
  }

  componentDidMount() {
    axios.get(`http://127.0.0.1:8000/api/all-articles`).then((response) => {
      console.log(response.data);
      this.setState({
        articles: response.data,
      });
    });
  }

  render() {
    let articleCategories = {};
    // iterate through the articles array
    this.state.articles.map((article) => {
      if (article.is_approved === "Yes") {
        // iterate through all the categories of the article
        return article.category.map((categoryArray) => {
          // if category already exists
          if (categoryArray.category in articleCategories) {
            return articleCategories[categoryArray.category].push(
              article.title
            );
          }
          // if category is unique
          else {
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
    // converting the article category object into array
    const cat = Object.keys(articleCategories).map((cat, id) => {
      let title = articleCategories[cat];
      // calling the Categories component with required props
      return <Categories key={id} category={cat} title={title} />;
    });
    return <div>{cat}</div>;
  }
}

export default ArticleList;
