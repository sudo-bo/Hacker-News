"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="${checkFavorites(story)}"></span>
        <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
        </a>
        <small class="story-hostname">(${hostName})\t|</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
  `);
}

function checkFavorites(story) {
  if (currentUser) {
    if (currentUser.hasFavorite(story)) {
      return "fas fa-star";
    }
  }
  return "far fa-star";
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  $favoriteStoriesList.empty();
  $myStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
    if (currentUser) {
      if (currentUser.hasFavorite(story)) {
        const $favorite = generateStoryMarkup(story);
        $favoriteStoriesList.append($favorite);
      }
      if (currentUser.madeStory(story)) {
        const $userStory = generateStoryMarkup(story);
        $userStory.append('<i id="remove-button" class="fas fa-times"></i>');
        $myStoriesList.append($userStory);
      }
    }
  }

  $allStoriesList.show();
}

/** Handle story submission. Add story to backend api and update page */

async function submitStory(evt) {
  console.debug("submit story", evt);
  evt.preventDefault();

  // grab the author, story title, and url
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  const newStoryEntry = { title, author, url };
  const newStory = await storyList.addStory(currentUser, newStoryEntry);
  const $newStoryUI = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStoryUI);

  $createStoriesForm.trigger("reset");
  $createStoriesForm.hide();
  $allStoriesList.show();

  putStoriesOnPage();
}

$createStoriesForm.on("submit", submitStory);

/** Handle favoriting stories. When a user favorites a story, we will update the backend api and
 * update the UI */

async function updateFavorite(evt) {
  if (currentUser) {
    console.debug("updating Favorites");

    if (evt.target.classList.contains("far")) {
      evt.target.classList.remove("far");
      evt.target.classList.add("fas");

      const storyId = evt.target.parentElement.id;
      const newFavorite = await currentUser.addFavorite(storyId);
      const $newFavoriteUI = generateStoryMarkup(newFavorite);
      $favoriteStoriesList.append($newFavoriteUI);
    } else {
      evt.target.classList.remove("fas");
      evt.target.classList.add("far");

      const storyId = evt.target.parentElement.id;
      const newFavorite = await currentUser.removeFavorite(storyId);
      for (let li of $favoriteStoriesList.find("li")) {
        if (li.id === storyId) {
          li.remove();
        }
      }
    }
  } else {
    console.debug("not signed in");
  }
}

$body.on("click", ".fa-star", updateFavorite);

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);
}

function addHighlight(evt) {
  $(evt.target).css("background-color", "rgba(255, 102, 0, 0.5)");
}
function removeHighlight(evt) {
  $(evt.target).css("background-color", "");
}
$myStoriesList.on("mouseover", "#remove-button", addHighlight);
$myStoriesList.on("mouseleave", "#remove-button", removeHighlight);
$myStoriesList.on("click", "#remove-button", deleteStory);
