import App from './app';

/*
 * Calls the app() and waits for it to return a DOM element
 * */

const app = async () => {
  document.getElementById("app").appendChild(await App());
};

app();

