import "./assets/scss/app.scss";
import $ from "cash-dom";
import { forEachPolyfill, includesPolyfill } from "./polyfills";
import axios from "axios";
import es6Promise from "es6-promise";
es6Promise.polyfill();

export class App {
  initializeApp() {
    // Pollyfills for IE11
    forEachPolyfill();
    includesPolyfill();

    // Event handler for clicking on button
    $(".load-username").on("click", () => {
      const userName = $(".username.input").val();

      this.getDataFromAPI(userName);
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

  updateProfile() {
    $("#profile-name").text($(".username.input").val());
    $("#profile-image").attr("src", this.profile.avatar_url);
    $("#profile-url")
      .attr("href", this.profile.html_url)
      .text(this.profile.login);
    $("#profile-bio").text(this.profile.bio || "(no information)");
  }
}
