import "./assets/scss/app.scss";
import $ from "cash-dom";
import { forEachPolyfill, includesPolyfill } from "./polyfills";
import axios from "axios";
import es6Promise from "es6-promise";
es6Promise.polyfill();

export class App {
  constructor() {
    this.validInput = false;
  }

  initializeApp() {
    // Pollyfills for IE11
    forEachPolyfill();
    includesPolyfill();

    // Event handler for clicking on button
    $(".load-username").on("click", () => {
      if (this.validInput) {
        const userName = $(".username.input").val();

        this.getDataFromAPI(userName);
      }
    });

    // Event handler for typing in text input
    $(".input").on("keyup", e => {
      this.handleInputChange(e);
    });

    // Event handler for pasting text in text input
    $(".input").on("paste", e => {
      this.handleInputChange(e);
    });
  }

  // Fetch data from Github API
  async getDataFromAPI(userName) {
    axios
      .get(`https://api.github.com/users/${userName}`)
      .then(response => {
        this.profile = response.data;
        this.updateProfile();
      })
      .catch(error => {
        console.log(error);
        alert("User not found");
      });
  }

  // Text input validation
  handleInputChange(e) {
    const inputValue = e.target.value;
    const regex = /[a-z0-9-_]/g;

    if (
      inputValue !== "" &&
      inputValue.match(regex) !== null &&
      inputValue.match(regex).length === inputValue.length
    ) {
      this.validInput = true;
      e.target.style.border = "1px solid #dbdbdb";
    } else {
      this.validInput = false;
      e.target.style.border = "1px solid red";
    }
  }

  // Update profile with fetched data
  updateProfile() {
    $("#profile-name").text($(".username.input").val());
    $("#profile-image").attr("src", this.profile.avatar_url);
    $("#profile-url")
      .attr("href", this.profile.html_url)
      .text(this.profile.login);
    $("#profile-bio").text(this.profile.bio || "(no information)");
  }
}
