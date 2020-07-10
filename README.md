# Fontaine

<p align="center">
  <img src="https://raw.githubusercontent.com/EndaHallahan/Fontaine-Editor/master/assets/Fontaine-Icon.svg" width="200px" height="200px">
</p>
<p align="center">
  <a href="https://fontaineeditor.com/">Website</a>
  |
  <a href="https://docs.google.com/spreadsheets/d/1GTWAjLHLYGKWDISHGuxgt9Kis45DEAMI0161KG0S4yY/edit?usp=sharing">Progress Tracker</a>
</p>

A modern manuscript editor for all major platforms and (eventually) the web. **This project is still in its early stages**.

### A lot goes into writing a book. Or a paper. Or a screenplay. Or a...
That's why you need powerful tools to keep your rapidly-growing projects under control, so you can focus on what's important: putting words on paper. Fontaine aims to be the first tool in your toolbox.

## Contributing
Glad to have you! Check the <a href="https://docs.google.com/spreadsheets/d/1GTWAjLHLYGKWDISHGuxgt9Kis45DEAMI0161KG0S4yY/edit?usp=sharing">progress tracker</a> to see what needs doing. If you're interested in adding a feature that isn't listed on the tracker, we recommend opening an issue first for discussion. 

## Development and Building
Fontaine is split into two parts: the frontend and the backend. To work with either, you will need to have Node and Yarn installed.

### Frontend
The frontend resides in `app-frontend`, and houses Fontaine's interface and most of its application logic. To set up the frontend, you must first install packages. From the root:
```
cd app-frontend
yarn install
```

You can run the frontend by itself in a browser with the following command:
```
yarn start
```

This can be useful for rapid development.

### Backend
The backend houses Electron and the logic that interacts with the computer and its filesystem. It is located within the `app-backend` folder. To set up the backend, you must have first installed packages on the frontend. You will also need to have Neon installed; for information on how to install Neon, see [here](https://neon-bindings.com/docs/getting-started). Then, from the root:
```
cd app-backend
yarn install
yarn native-build
```

To create or re-create the test project, use the following (note: this command only works on Windows):
```
yarn regenerate-test-project
```

To run the backend in development mode, use:
```
yarn start
```

To build the backend, use:
```
yarn build
```

