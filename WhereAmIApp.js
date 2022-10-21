/*
Your tasks:
PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value ('lat')
and a longitude value ('lng') (these are GPS coordinates, examples are in test
data below).
2. Do “reverse geocoding” of the provided coordinates. Reverse geocoding means
to convert coordinates to a meaningful location, like a city and country name.
Use this API to do reverse geocoding: https://geocode.xyz/api. The AJAX call
will be done to a URL with this format:
https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and
promises to get the data. Do not use the 'getJSON' function we created, that
is cheating �
3. Once you have the data, take a look at it in the console to see all the attributes
that you received about the provided location. Then, using this data, log a
message like this to the console: “You are in Berlin, Germany”
4. Chain a .catch method to the end of the promise chain and log errors to the
console
5. This API allows you to make only 3 requests per second. If you reload fast, you
will get this error with code 403. This is an error with the request. Remember,
fetch() does not reject the promise in this case. So create an error to reject
the promise yourself, with a meaningful error message
PART 2
6. Now it's time to use the received data to render a country. So take the relevant
attribute from the geocoding API result, and plug it into the countries API that
we have been using.
7. Render the country and catch any errors, just like we have done in the last
lecture (you can even copy this code, no need to type the same code

    Test data:
§ Coordinates 1: 52.508, 13.381 (Latitude, Longitude)
§ Coordinates 2: 19.037, 72.873
§ Coordinates 3: -33.933, 18.474
GOOD LUCK
    */

//Created a shorthand for document.getElementById
const byId = function (id) {
  return document.getElementById(id);
};

let height = window.innerHeight;
console.log(height);
byId('body').style.height = `${height}px`;
const CordsResultCont = document.querySelector('.CordsResultCont');
const findByCords = byId('findByCords');
const latInput = byId('latInput');
const longInput = byId('longInput');
const addressDisplay = document.querySelector('#outputContainer');
const findMeButton = byId('findMeButton');

const whereAmI = function (lat, long) {
  apiKey = '94e287d2bd954a02a7a90a21260f82a8';
  fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${apiKey}`
  )
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(jsonData => {
      const addressFetched = jsonData.features[0].properties.formatted;
      console.log(addressFetched);
      addressRender(addressFetched);
    })
    .catch(error => console.log(`error is: ${error}`));
};

const whereByCords = function (lat, long) {
  apiKey = '94e287d2bd954a02a7a90a21260f82a8';
  fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${apiKey}`
  )
    .then(response => {
      console.log(response);
      if (!lat || !long) {
        throw new Error(
          'Please check if you entered correct latitude and longitude. Something is missing from your end!'
        );
      }
      return response.json();
    })
    .then(jsonData => {
      const addressFetched = jsonData.features[0].properties.formatted;
      console.log(addressFetched);
      addressRenderCords(addressFetched);
    })
    .catch(error => {
      alert(`error is: ${error}`);
      CordsResultCont.style.opacity = 1;
      CordsResultCont.innerHTML = `<p class = 'addressText'>${error}</p>`;
    });
};

function addressRender(addr = 'Somewhere on Earth') {
  const html = `<p class = 'addressText'>You have been found!<br> You are currently at:<br> ${addr}</p>`;
  return (addressDisplay.innerHTML = html);
}

function addressRenderCords(addr = 'Somewhere on Earth') {
  const html = `<p class = 'addressText'>Located!<br> Address at:<br> ${addr}</p>`;
  return (CordsResultCont.innerHTML = html);
}

findByCords.addEventListener('click', () => {
  CordsResultCont.style.opacity = 1;
  whereByCords(latInput.value, longInput.value);
});

const getLocation = () => {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position);
      return whereAmI(
        `${position.coords.latitude}`,
        `${position.coords.longitude}`
      );
    },
    { enableHighAccuracy: true }
  );
};

findMeButton.addEventListener('click', () => {
  //get user's current location:
  getLocation();
  byId('outputContainer').style.opacity = 1;
});
