import "./assets/scss/app.scss";
import { forEachPolyfill, includesPolyfill } from "./polyfills";
import $ from "cash-dom";
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
        $("#spinner").removeClass("is-hidden");
        const userName = $(".username.input").val();

        this.getDataFromAPI(userName);
        this.addEventToHistory(userName);
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
        $(".profile").removeClass("is-hidden");
        this.profile = response.data;
        this.updateProfile();
      })
      .catch(error => {
        console.log(error);
        alert("User not found");
        $("#spinner").addClass("is-hidden");
      });
  }

  // Adding event to History Tab
  addEventToHistory(userName) {
    const eventTypes = ["PullRequestEvent", "PullRequestReviewCommentEvent"];

    axios
      .get(`https://api.github.com/users/${userName}/events/public`)
      .then(response => {
        const foundEvents = response.data.filter(event => {
          if (eventTypes.includes(event.type)) {
            return event;
          }
        });
        this.populateHistoryList(foundEvents);
        $("#spinner").addClass("is-hidden");
      })
      .catch(error => {
        console.log(error);
        $("#spinner").addClass("is-hidden");
      });
  }

  // Appending new event to the DOM
  populateHistoryList(foundEvents) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    foundEvents.map(event => {
      const d = new Date(event.created_at);

      const date = `${
        monthNames[d.getMonth()]
      } ${d.getDate()}, ${d.getFullYear()}`;

      const markup = `
      <div class="timeline-item is-primary">
        <div class="timeline-marker is-primary"></div>
        <div class="timeline-content">
          <p class="heading">${date}</p>
          <div class="content">
            <span class="gh-username">
              <img
                src="${event.actor.avatar_url}"
              />
              <a href="https://github.com/${event.actor.display_login}">${event.actor.display_login}</a>
            </span>
            ${event.payload.action}
            <a href="${event.payload.pull_request.html_url}"
              >pull request</a
            >
            <p class="repo-name">
              <a href="https://github.com/${event.repo.name}"
                >${event.repo.name}</a
              >
            </p>
          </div>
        </div>
      </div>`;

      document.querySelectorAll(".timeline-item").forEach(node => {
        node.classList.remove("is-primary");
        node.children[0].classList.remove("is-primary");
      });

      document
        .querySelector("#user-timeline")
        .insertAdjacentHTML("afterbegin", markup);
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
