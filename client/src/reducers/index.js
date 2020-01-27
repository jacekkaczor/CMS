import { combineReducers } from "redux";
import auth from "./auth";
import common from "./common";
import posts from "./posts";

export default combineReducers({
  auth,
  posts,
  common
});