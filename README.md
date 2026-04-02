# WEB103 Prework - *Creatorverse*

Submitted by: **Sheung Wan Wong**

About this web app: **Creatorverse is a React and Supabase app for browsing, adding, editing, and deleting favorite content creators through a polished card-based interface.**

Time spent: **12** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [x] **A logical component structure in React is used to create the frontend of the app**
- [x] **At least five content creators are displayed on the homepage of the app**
- [x] **Each content creator item includes their name, a link to their channel/page, and a short description of their content**
- [x] **API calls use the async/await design pattern via Axios or fetch()**
- [x] **Clicking on a content creator item takes the user to their details page, which includes their name, url, and description**
- [x] **Each content creator has their own unique URL**
- [x] **The user can edit a content creator to change their name, url, or description**
- [x] **The user can delete a content creator**
- [x] **The user can add a new content creator by entering a name, url, or description and then it is displayed on the homepage**

The following **optional** features are implemented:

- [ ] Picocss is used to style HTML elements
- [x] The content creator items are displayed in a creative format, like cards instead of a list
- [x] An image of each content creator is shown on their content creator card

The following **additional** features are implemented:

* [x] Added a cinematic landing page with smooth-scroll shortcuts to the creator list and add-creator form
* [x] Added loading, empty, error, and not-found states across the app for clearer Supabase feedback
* [x] Added reusable form validation plus a seed script and Vitest coverage for the CRUD flows

## Video Walkthrough

Here's a walkthrough of implemented required features:

https://www.youtube.com/watch?v=U0lfyE8d88w


GIF preview generated from the recorded walkthrough for README rendering.

## Notes

The main challenge was making the CRUD flow feel complete instead of just technically functional. That included keeping the landing page and creator management flows on-brand, handling empty/error states cleanly, and making sure the same Supabase-backed data worked across list, detail, add, edit, and delete interactions.

## License

Copyright [2026] [Sheung Wan Wong]

Licensed under the ISC License.
