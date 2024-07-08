# Skedulo Tech Test

## Pre-Requisites

- Node
- Npm

## Installation Instructions

Install:
`yarn bootstrap`

This installs everything for the App as well as the Server, so please don't run `npm install` (unless you also want to run it from the `server` folder)

## Running the App

Run:
`yarn start`

## Testing the App

Run:
`yarn test`

## Overview

Hi! Welcome to the Skedulo frontend tech project. You will see we have 3 questions and each of their instructions are located in the local INSTRUCTIONS.md. Please complete these exercises then save to a private github repository. Once you're ready reach out to your hiring manager and they will share some github names to add as collaborators who will review your submission.

Once you have completed all exercises it would be great to see a readme that contains some of your thinking while working through the test, constraints you worked within, some decisions and compromises you needed to make, and anything else you think would be interesting for the reviewers to know.

- [Question 1](./src/question-one/INSTRUCTIONS.md) - React input example
- [Question 2](./src/question-two/INSTRUCTIONS.md) - Data manipulation from multiple sources
- [Question 3](./src/question-three/INSTRUCTIONS.md) - Responsive CSS design

Good luck! And if you have any questions, don't hesitate to contact your hiring manager.

# Applicant Approach

## Question One

My idea was to keep this simple by starting with the basics of adding an input (not styling at first) where there would be an event handler listening for changes (onChange). Through that handler, I would be able to set a local state variable to better control the input. Based on the requirement provided we would have to call the API to run the job search after reaching minimun 3 characters on the count, therefore we must add a check for that. However, to make the experience even better, we probably should make use of a debounce mechanism, to avoid hitting the service too often (bad practice). The debounce would allow for the API call to only be triggered after a certain ammount of time has passed after the user last interacted with the input, making the experience the same for him, without smashing the server.
Furthermore, we have to present a loading state to the user while the search is running, and for that purpose we can introduce a flag that will be true whenever we call the API and false when we get a response (or failure). We then use this flag to show/hide a UI element to indicate something is going on behind the scenes. We also would want to display a message whenever the search came up empty, users hate when a website does not tell them what is going on. For that purpose, I've created another local state variable that stores the flag to whenever the API has been invoked or not, based on that and the fact the jobs list is empty, we can show the empty results string.
Another thing to note is I also decided to not make the filtering of the results case sensitive, because we don't wan't to force the users to know exaclty when to use lower/upper casing when searching.
I then decided to move to the unit testing for question one, creating a few shell it() blocksto decide which scenarios would be important to test.
A few obvious choices of tests are making usre the component renders correctly, that the search triggers a api call (using jest mocks we can do that without calling the real one) and so on.
We then add some styles to it, to make it more user friendly and appealing.
