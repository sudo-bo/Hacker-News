"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  // might come back and use hidePageComponents()
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();

  $loginForm.hide();
  $signupForm.hide();

  $navSubmitStoryButton.show();
  $favoriteStoriesList.hide();
  $navFavoritesButton.show();
  $navMyStoriesButton.show();
}

/** When a user decides to submit a story, update the navbar to reflect that. */

function navSubmitStory(evt) {
  console.debug("navNewStory", evt);
  hidePageComponents();
  $createStoriesForm.addClass("stories-list");
  $createStoriesForm.show();
  $allStoriesList.show();
}

$navSubmitStoryButton.on("click", navSubmitStory);

/** When a user decides to see favorites, update the page  to reflect that. */

function showFavorites(evt) {
  console.debug("showing favorites");
  hidePageComponents();
  $favoriteStoriesList.addClass("stories-list");
  $favoriteStoriesList.show();
}

$navFavoritesButton.on("click", showFavorites);

function showMyStories(evt) {
  console.debug("showing my stories");
  hidePageComponents();
  $myStoriesList.addClass("stories-list");
  $myStoriesList.removeClass("hidden");
  $myStoriesList.show();
}
$navMyStoriesButton.on("click", showMyStories);
