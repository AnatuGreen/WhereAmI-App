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

// let height = window.innerHeight;
// console.log(height);
// byId('body').style.height = `${height}px`;
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
      if (!response.ok) {
        throw new Error(
          `
          Oops!😢
          Something went wrong with server request.
          Maybe there is an error with the API call or the API key expired.
          Please visit our FAQs to see possible causes/solutions of
          errors like this.
          If problem persists, send a DM to @AnatuGreen on Twitter`
        );
      }
      return response.json();
    })
    .then(jsonData => {
      const addressFetched = jsonData.features[0].properties.formatted;
      theCountryFetched = jsonData.features[0].properties.country;
      console.log(jsonData);
      console.log(addressFetched);
      addressRender(addressFetched);
      countryRender(`${theCountryFetched}`);
    })
    .catch(error => {
      console.log(`error is: ${error}`);
      alert(error);
    });
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
      theCountryFetched = jsonData.features[0].properties.country;
      console.log(addressFetched);
      addressRenderCords(addressFetched);
      countryRender(`${theCountryFetched}`);
    })
    .catch(error => {
      alert(`error is: ${error}`);
      CordsResultCont.style.opacity = 1;
      CordsResultCont.innerHTML = `<p class = 'addressText'>${error}</p>`;
    });
};

//The component that has the html that
function addressRender(addr = 'Somewhere on Earth') {
  const html = `<div class ='addressAndCountContainer'><p class = 'addressText'>You have been found!<br> You are currently at:<br> ${addr}</p></div>`;
  return (addressDisplay.innerHTML = html);
}

//Create the element to display the flag, Use RestCountries API to get the country's flag and render it
function countryRender(country) {
  function renderCountryFlag(locality) {
    const flagHtml = `<div class="flagContainer">
<img src="${locality}" class="flagContainer"  />
  </div>
  `;
    console.log(locality);
    document
      .querySelector('.addressText')
      .insertAdjacentHTML('afterend', flagHtml);
  }

  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      renderCountryFlag(`${data[0].flags.png}`);
    });
}

//Address render for when user enters their own coordinates
function addressRenderCords(addr = 'Somewhere on Earth') {
  const html = `<div class ='addressAndCountContainer'><p class = 'addressText'>Located!<br> Address at:<br> ${addr}</p>div class ='addressAndCountContainer'>`;
  return (CordsResultCont.innerHTML = html);
}

//Eventlistener for the "Find Location" button
findByCords.addEventListener('click', () => {
  CordsResultCont.style.opacity = 1;
  whereByCords(latInput.value, longInput.value);
});

//Get user location when they click "Find me" and accept the browser request. This is called inside findMeButton
const getLocation = () => {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position);
      whereAmI(`${position.coords.latitude}`, `${position.coords.longitude}`);
    },
    function () {
      alert(`You declined to give out your location. No result will be given.
    To reset this, reset permissions for this site: On Chrome and Edge: Settings > Cookies and Site Permisions > Recent Activity or ALl Sites > WhereAmIApp or LocalServer Address > Reset Permissions`);
    },
    { enableHighAccuracy: true }
  );
};

//Call the getLocation function to get the user location and whereAmI. Also displays the container by raising opacity
findMeButton.addEventListener('click', () => {
  getLocation();
  byId('outputContainer').style.opacity = 1;
});
