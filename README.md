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

My idea was to keep this simple by starting with the basics of adding an input (not styling at first) where there would be an event handler listening for changes (onChange). Through that handler, I would be able to set a local state variable to better control the input. Based on the requirement provided we would have to call the API to run the job search after reaching minimun 3 characters on the count, therefore we must add a check for that. However, to make the experience even better, we probably should make use of a debounce mechanism, to avoid hitting the service too often (bad practice). The debounce would allow for the API call to be triggered only after a certain ammount of time has passed after the user last interacted with the input, keeping the experience for the user exactly the same, without smashing the server.

Furthermore, we have to present a loading state to the user while the search is running, and for that purpose we can introduce a flag that will be true whenever we call the API and false when we get a response (or failure). We then use this flag to show/hide a UI element to indicate something is going on behind the scenes. We also would want to display a message whenever the search comes up empty, users hate when a website does not tell them what is going on, which generally causes them to be frustrated and then they decide to leave. For that purpose, I've created another local state variable that stores the flag to whenever the API has been invoked or not, based on that and the fact the jobs list is empty, we can show the empty results string.
Another thing to note is I also decided to not make the filtering of the results case sensitive, because we don't wan't to force the users to know exaclty when to use lower/upper casing when searching, since they have no idea what is the exact casing returned by the service.

I then decided to move to the unit testing for question one, creating a few shell it() blocks to decide which scenarios would be important to test.

A few obvious choices of tests are making sure the component renders correctly, that the search triggers a api call (using jest mocks we can do that without calling the real one) and so on.
Finally I decided to add some styles to it, to make it the UI is a bit more appealing, but not focusing too much on it, as it appears it is not the main focus of this question (seems like nice UIs will be covered by question 3),

## Question Two

This was a bit on an interesting one. Initially I did not fully understood what was being asked, but later on it became clear that it was all about merging data from multiple APIs, manipulating it using a few known javascript operators (filter, map etc) to get the desired output (stated on the unit test).
For the foundation of this challenge, it was important to make sure I followed the provided the type to be used for the final object:

```
interface Allocation {
  allocType: 'job' | 'activity';
  name: string;
  start: string;
  end: string;
}

interface ResourceSchedule {
  resourceName: string;
  resourceId: number;
  allocations: Allocation[];
}
```

So the first step was to determine the relationship between the sets of data:
resoucers -> activity allocation -> activity
resoucers -> job allocation -> job

`Important Assumption 1: start and end date are always on the same date (only during business hours)`

We first start by filtering the activities and jobs to the relevant date (although it does not seem necessary given the data already only contains elements of the specified date), it was still part of the brief so I'm including a check to filter jobs within that date.
Then we mount the data according to the desired format, starting with resources (as the base of everything), then for each resource we get the activity and job allocations and finally match those allocations with the actual activity and job data. Everything done through filters using the necessary IDs to match out the object, and we ultimately map the data to match the allocation type specified.
Last but not least, we run a simple JSON.stringify to get the final blob in the correct shape for the unit test to pass.

One important aspect of this challenge was to make use we are optimizing the usage of memory with the use of memoization through the usage of useCallback on the filterForTargetDate function, which helps with some performance enhancement by avoiding redundant calculations whenever possible.

One of the concessions I made was the fact the IDs of some of the models used where not matching the types provided, and therefore for comparisson pursoses when filtering, the method .toString() was used to make sure the IDs where being compared correctly (===), therefore also matching types.

## Question Three

The first step for tackling the question three was to understand the UI requirements specified in the INSTRUCTIONS.md file, which would dictate the separation of concerns, context, component structure and more.

After understanding them, the first step is to come up with the component structure based on the Figma mock, in a way that is reusable and clear. Other than that, we must also define some classes that will reprensent the context of the elements on the screen, so children classes can inherit properties whenever it makes sense.
One of the important parts is make sure the Header is dynamic, in other words, takes up React children and displays them.

For most of the styling, I've decided to use flexbox as it is a really easy and standard approach in the industry to organise the CSS in a responsive way that works well for all screen sizes, making use of rows, columns etc. In this case I've made the priority the left column in the sense that if ever opened on a smaller screen device, we would never lose visibility of that content (there is a min-width provided). The right column however, can shrink in size (as there is currently nothing there at the moment other than the empty cards). Eveything done accoding to the Figma mocks, using fonts, colours and more directly from there.

I've also decided to create two new components: Header and JobCard.
The Header component exists so I can easily unit test the children are being properly displayed and it is a reusable and separate component (contextually speaking).
The JobCard was created so that it can be reused, tested and have its context independent from the main component. This one needed to make use of some additional memoization techniques (useMemo) to again enhance performance and memory consuption, as there where a few functions we could avoid having to recalculate the output.

Each component, including the main questionThree component have had unit tests added to verify the functionality is correct according to the requirements.

Interesting note: One of the things I almost missed from the Figma mock, was the job id number with the padding: e.g 1 as 001 and so on.

Finally, one of the decisions I've made was to keep the Parent header of the app (with the questions tabBar navigation) so it was still easy to navigate between questions - not sure if this goes against the requirement of making the layout of Question Three take up the height/width of the whole screen, but it was a decision I've made, and for that reason I've also included a small (1px solid black) border right at the top of the Header, to distinguish what is part of the question and what is not.

## Closing Remarks

Given that some of the questions involved date manipulation, comparisson and formatting I've decided to install a library called date-fns, which is a pretty lightweight and provides some helper functions, making date manipulation much easier. Definetely could have gone with something like momentjs which is extremelly popular, but that one is much more powerful and therefore a lot heavier, a fact that sometimes needs to be taken into consideration.

Within the unit tests I've used some jest.fn() mock functions to fake the api calls in order to blackbox the component, guaranteeing the unit test is independant. This also allows for some observability in the sense of knowing when, how and with what props the apis where called.
