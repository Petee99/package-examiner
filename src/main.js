import App from './App';

const app = async () => {
  document.getElementById("app").appendChild(await App());
};

app();

function handleFormEvents(event){
  event.preventDefault();
  console.log(event);
}

