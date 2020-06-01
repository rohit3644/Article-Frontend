import React from "react";
import { Container } from "react-bootstrap";
import classes from "./ReadMore.module.css";
import axios from "axios";

class ReadMore extends React.Component {
  constructor(props) {
    super(props);
    const filteredArray = this.props.article.filter((el) => {
      return el != null;
    });
    this.state = {
      selectedId: filteredArray[0].id,
      isrender: false,
      title: filteredArray[0].title,
      content: filteredArray[0].content,
      author: filteredArray[0].author_name,
      categories: "",
      imageName: filteredArray[0].image_name,
    };
  }

  componentDidMount() {
    const data = {
      selectedId: this.state.selectedId,
    };
    axios.post("http://127.0.0.1:8000/api/read-more", data).then((response) => {
      let category = [];
      console.log(response.data);
      response.data.map((ele) => {
        return category.push(ele.category);
      });
      let str = category.join(", ");
      this.setState({ isrender: true, category: str });
    });
  }

  render() {
    if (!this.state.isrender) {
      return <div className="loader">Loading...</div>;
    }

    return (
      <div>
        {this.state.title !== "" ? (
          <Container className={classes.ReadMore}>
            <img
              src={this.state.imageName}
              alt="pic"
              width="250"
              height="250"
            />
            <hr />
            <h3>{this.state.title}</h3>
            <hr />
            <strong>
              Category: <a href="#">{this.state.category}</a>
            </strong>
            <hr />
            <p>{this.state.content}</p>
            <hr />
            <p>Author: {this.state.author}</p>
          </Container>
        ) : (
          <div style={{ color: "gray", textAlign: "center" }}>
            <h1>Error 404: Page Not Found</h1>
            <svg
              className={classes.checkmark1}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className={classes.checkmark__circle1}
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className={classes.checkmark__check1}
                fill="none"
                d="M16 16 36 36 M36 16 16 36"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }
}

export default ReadMore;
