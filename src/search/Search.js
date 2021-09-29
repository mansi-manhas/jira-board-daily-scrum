import React from "react";
//import "./Search.css";

const Search = props => {
  return (
    <div className="ui search">
      <div className="ui icon input">
        <input
          onChange={props.onChangeHandler}
          className="prompt"
          type="text"
          placeholder="Search"
        />
        {/* allIssues={props.allIssues}
          searchText={props.searchText} */}
        <i className="search icon" />
      </div>
      <div className="results" />
    </div>
  );
};

export default Search;