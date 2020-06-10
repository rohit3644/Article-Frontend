import React from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import classes from "./Categories.module.css";

// this component display the categories and respective articles
// under the categories as an accordion

const Categories = (props) => {
  return (
    <div>
      <Accordion defaultActiveKey="1" className={classes.Style}>
        <Card>
          <Card.Header style={{ backgroundColor: "lightblue" }}>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              {props.category}
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              {/* converting the article title to clickable links */}
              {props.title.map((article, id) => {
                let link = "/" + article.split(" ").join("-").toLowerCase();
                return (
                  <div key={id}>
                    <a href={link}>{article}</a>
                  </div>
                );
              })}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default Categories;
