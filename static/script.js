

// This function is here so that the user favorites get updated in the show_results route if the user
// hits back from the favorties route after unfavoriting a wine.
window.addEventListener( "pageshow", function ( event ) {
  const address = document.location.href;

  // if (address.includes("show_results") ) {
      var historyTraversal = event.persisted || 
            ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
      if ( historyTraversal ) {
        window.location.reload();
      }
  // }
});

// =================================================  WINE TYPE / HOME PAGE  ================================================

$("#wine-type").on("click", ".wine-type", async function(e) {
  const selected_button = e.target;

  // selected_button.classList.toggle("is-focused")
  $(selected_button).toggleClass("is-light")

  wine_type = selected_button.innerText
  varietalDiv = $("#varietals")
  varietalDiv.html("")

  await sendWineType(wine_type)

  const items = await axios.get('/get_varietals')
  varietal_array = items.data.varietals;
  selected_varietals = items.data.selected_varietals;

  populateVarietals(varietal_array, selected_varietals)
  
})

async function sendWineType(wine_type) {
  const res = await axios.get(`/wine_type/${wine_type}`)
}

// =================================================  SORT BY / HOME PAGE ================================================

$("#filter-by").on("click", ".filter-by", async function(e) {
  const selected_button = e.target;

  // selected_button.classList.toggle("is-focused")
  $(selected_button).toggleClass("is-light")

  filterBy = selected_button.innerText
  
  await sendSortBy(filterBy)
  
})

async function sendSortBy(filterBy) {
  const res = await axios.get(`/sort_by/${filterBy}`)
}

// =================================================  LOADING VARIETALS / HOME PAGE ================================================
function populateVarietals(varietal_array, selected_varietals) {

for (varietal of varietal_array) {
  if (selected_varietals.includes(varietal)) {
    html = `<button class="button is-info is-rounded mt-3 mb-2 mx-2 varietals">${varietal}</button>`
    varietalDiv.append(html);
  } else {
    html = `<button class="button is-info is-light is-rounded mt-3 mb-2 mx-2 varietals">${varietal}</button>`
    varietalDiv.append(html);
  }

}
}




// =================================================  PICKING VARIETALS / HOME PAGE  ================================================


$("#varietals").on("click", ".varietals", async function(e) {
  const selected_button = e.target;

  // selected_button.classList.toggle("is-focused")
  $(selected_button).toggleClass("is-light")

  varietal = selected_button.innerText
  await sendVarietals(varietal)
})



async function sendVarietals(varietal) {
  const res = await axios.get(`/log_varietals/${varietal}`)
}






// =================================================  POPULATE WINE RESULTS ================================================

const addWineCard = function(wine, favBtn, reviewBtn, reviewHTML, cardSize) {

  const html = `<div class="column ${cardSize}">
  <div class="has-text-centered">
  </div>

<article class="message is-info">
  
  <div class="message-header">
    <p>${wine['Name']}</p>
  </div>

  <div class="message-body">
    <p><strong>NAME: </strong>${wine['Name']}</p>
    <p><strong>WINERY: </strong>${wine['Winery']}</p>
    <p><strong>COUNTRY: </strong>${wine['Country']}</p>
    <p><strong>AREA: </strong>${wine['Area']}</p>
    <p><strong>VINTAGE: </strong>${wine['Vintage']}</p>
    <p><strong>VARIETAL: </strong>${wine['Varietal']}</p>
    <p><strong>TYPE: </strong>${wine['Type']}</p>
    <p><strong>RATING: </strong>${wine['Rating']}</p>
  </div>

  <div class="columns">
    <div class="column is-half has-text-centered mx-0 my-0">
      <button class="button is-text favorite-button" data-id="${wine['ID']}">
        <span class="icon">
        ${favBtn}
        </span>
      </button>
    </div>
    <div class="column is-half has-text-centered mx-0 my-0" id="review-btn">
    <a href="/user/review/${wine['ID']}" class="button is-text review-btn" data-id="${wine['ID']}">
        <span class="icon review-btn">
        ${reviewBtn}
        </span>
      </a>
    </div>
  </div>
  ${reviewHTML}
</article>
  </div>`

  return html;

}

const addReviewHTML = function(wine) {

  html = `<hr class="dropdown-divider"> 
<br>

 <div class="ml-5 has-text-info-dark">
    <p><strong>MY RATING: </strong>${wine['Post_rating']}</p>
    <p><strong>REVIEW: </strong>${wine['Post_review']}</p>
  </div>
  <br>

  
    <div class="field is-grouped ml-5" id="review-delete">
    <button class="button is-info is-outlined review-delete mb-5" data-id="${wine['ID']}">
    <span class="review-delete">Delete</span>
  </button>


  <a href="/user/reviews/${wine['ID']}" class="button is-info is-outlined edit-review mb-5 ml-2">
    <span>Edit</span>
  </a>
</div>`

return html
}


function populateWineResults(wine_results, favorites, reviews, fav_wines, wine_reviews) {
  wineHtml = $("#wine-results")
  wineHtml.html("")
  const address = document.location.href;


  if (wine_results[0] == "No Results") {
    
    message = `<section class="hero is-small is-light mt-6 mx-6">
  <div class="hero-body">
    <div class="container">
      <h1 class="title has-text-info">
        No wines available.
      </h1>
    </div>
  </div>
</section>`
    // const html = '<h3 class="title is-3 has-text-centered mt-6">No wines available.</h3>'
    wineHtml.append(message)

  } else if (address.includes("user/review")) {

   for (wine of wine_reviews) { 

    if (favorites.includes(wine['ID'])) {
        const favBtn = '<i class="fas fa-star"></i>';
        const reviewBtn = '<i class="fas fa-edit review-btn"></i>';
        const cardSize = 'is-one-third';
        const reviewHTML = addReviewHTML(wine)
        const html = addWineCard(wine, favBtn, reviewBtn, reviewHTML, cardSize)
        wineHtml.append(html)
      } else {
        const favBtn = '<i class="far fa-star"></i>';
        const reviewBtn = '<i class="fas fa-edit review-btn"></i>';
        const cardSize = 'is-one-third';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        const reviewHTML = addReviewHTML(wine)
        const html = addWineCard(wine, favBtn, reviewBtn, reviewHTML, cardSize)
        wineHtml.append(html)
      }

    }

  } else if (address.includes("user/favorites")) {

    for (wine of fav_wines) { 

    if (favorites.includes(wine['ID']) && reviews.includes(wine['ID'])) {
        const favBtn = '<i class="fas fa-star"></i>';
        const reviewBtn = '<i class="fas fa-edit review-btn"></i>';
        const reviewHTML = "";
        const cardSize = 'is-one-third';
        const html = addWineCard(wine, favBtn, reviewBtn, reviewHTML, cardSize)
        wineHtml.append(html)
      } else if (favorites.includes(wine['ID']) && !reviews.includes(wine['ID'])) {
          const favBtn = '<i class="fas fa-star"></i>';
          const reviewBtn = '<i class="far fa-edit review-btn"></i>';
          const reviewHTML = "";
          const cardSize = 'is-one-third';
          const html = addWineCard(wine, favBtn, reviewBtn, reviewHTML, cardSize)
          wineHtml.append(html)
      } else if (!favorites.includes(wine['ID']) && reviews.includes(wine['ID'])) {
          const favBtn = '<i class="far fa-star"></i>';
          const reviewBtn = '<i class="fas fa-edit review-btn"></i>';
          const reviewHTML = "";
          const cardSize = 'is-one-third';
          const html = addWineCard(wine, favBtn, reviewBtn, reviewHTML, cardSize)
          wineHtml.append(html)
      } else if (!favorites.includes(wine['ID']) && !reviews.includes(wine['ID'])) {
          const favBtn = '<i class="far fa-star"></i>';
          const reviewBtn = '<i class="far fa-edit review-btn"></i>';
          const reviewHTML = "";
          const cardSize = 'is-one-third';
          const html = addWineCard(wine, favBtn, reviewBtn, reviewHTML, cardSize)
          wineHtml.append(html)
      } 

    }

  } else {

    for (wine of wine_results) { 

    if (favorites.includes(wine['ID']) && reviews.includes(wine['ID'])) {
        const favBtn = '<i class="fas fa-star"></i>';
        const reviewBtn = '<i class="fas fa-edit review-btn"></i>';
        const reviewHTML = "";
        const cardSize = 'is-half';
        const html = addWineCard(wine, favBtn, reviewBtn, reviewHTML, cardSize)
        wineHtml.append(html)
      } else if (favorites.includes(wine['ID']) && !reviews.includes(wine['ID'])) {
          const favBtn = '<i class="fas fa-star"></i>';
          const reviewBtn = '<i class="far fa-edit review-btn"></i>';
          const reviewHTML = "";
          const cardSize = 'is-half';
          const html = addWineCard(wine, favBtn, reviewBtn, reviewHTML, cardSize)
          wineHtml.append(html)
      } else if (!favorites.includes(wine['ID']) && reviews.includes(wine['ID'])) {
          const favBtn = '<i class="far fa-star"></i>';
          const reviewBtn = '<i class="fas fa-edit review-btn"></i>';
          const reviewHTML = "";
          const cardSize = 'is-half';
          const html = addWineCard(wine, favBtn, reviewBtn, reviewHTML, cardSize)
          wineHtml.append(html)
      } else if (!favorites.includes(wine['ID']) && !reviews.includes(wine['ID'])) {
          const favBtn = '<i class="far fa-star"></i>';
          const reviewBtn = '<i class="far fa-edit review-btn"></i>';
          const reviewHTML = "";
          const cardSize = 'is-half';
          const html = addWineCard(wine, favBtn, reviewBtn, reviewHTML, cardSize)
          wineHtml.append(html)
      } 

    }

  }
}

// =================================================  FAVORITE BUTTON ON RESULTS PAGE ================================================


const getFavList = async function(wineId) {
  
  const json = await axios.post(`/user/add_favorite/${wineId}`)
  noUserObj = json.data

  // ##### CONDITIONAL TO CHECK TO SEE IF USER IS LOGGED IN IF NOT AN ERROR MESSAGE APPEARS #####
  if (Object.keys(noUserObj).length == 1) {
    
message = `<section class="hero is-small is-light">
  <div class="hero-body">
    <div class="container">
      <h1 class="title has-text-grey-dark">
        ${noUserObj.message}
      </h1>
    </div>
  </div>
</section>`

    flashDiv = $("#flash")
    flashDiv.html("");
    flashDiv.prepend(message)
    function hideMessage(){
      flashDiv.html("");
    }
    setTimeout(hideMessage, 2000);

  } else {
      const wine_results = await axios.get(`/wine_style/""`)
      wines = wine_results.data.wine_results;
      favs = json.data.fav_wine_list;
      reviews = wine_results.data.reviews;
      fav_wines = json.data.fav_wines;
      wine_reviews = json.data.wine_reviews;
      populateWineResults(wines, favs, reviews, fav_wines, wine_reviews)
  }
  
  
 
}



  // ##### CLEARS ALL FLASH MESSAGES AFTER 2 SECONDS #####

    $(document).ready(function(){ 
      flashDiv = $("#messageContainer");
        function hideMessage(){
          flashDiv.html("");
        }
        setTimeout(hideMessage, 2000);
    })

    


  $("#wine-results").on("click", ".favorite-button", async function(e) {

    const target = e.target;

    if (target.tagName == "BUTTON") {
      let wineId = target.dataset.id;
      getFavList(wineId);

    } else if (target.tagName == "path") {
      const button = target.parentElement.parentElement.parentElement;
      let wineId = button.dataset.id;
      getFavList(wineId);

    } else if (target.tagName == "SPAN") {
      const button = target.parentElement;
      let wineId = button.dataset.id;
      getFavList(wineId);

    } else if (target.tagName == "svg") {
      const button = target.parentElement.parentElement;
      let wineId = button.dataset.id;
      getFavList(wineId);

    }

  })

// =================================================  DELETE REVIEW / REVIEWS PAGE  ================================================

$("#wine-results").on("click", ".review-delete", async function(e) {
  const target = e.target;

 if (target.tagName == "BUTTON") {
      let wineId = target.dataset.id;
      const res = await axios.get(`/user/reviews/${wineId}/delete`)
      const wine_results = await axios.get(`/wine_style/""`)
      wines = wine_results.data.wine_results;
      favs = wine_results.data.user_favorites;
      reviews = wine_results.data.reviews;
      fav_wines = res.data.fav_wines;
      wine_reviews = res.data.wine_reviews;
      populateWineResults(wines, favs, reviews, fav_wines, wine_reviews)

    } else if (target.tagName == "path") {
      const button = target.parentElement.parentElement.parentElement;
      let wineId = button.dataset.id;
      const res = await axios.get(`/user/reviews/${wineId}/delete`)
      const wine_results = await axios.get(`/wine_style/""`)
      wines = wine_results.data.wine_results;
      favs = wine_results.data.user_favorites;
      reviews = wine_results.data.reviews;
      fav_wines = res.data.fav_wines;
      wine_reviews = res.data.wine_reviews;
      populateWineResults(wines, favs, reviews, fav_wines, wine_reviews)

    } else if (target.tagName == "SPAN") {
      const button = target.parentElement;
      let wineId = button.dataset.id;
      const res = await axios.get(`/user/reviews/${wineId}/delete`)
      const wine_results = await axios.get(`/wine_style/""`)
      wines = wine_results.data.wine_results;
      favs = wine_results.data.user_favorites;
      reviews = wine_results.data.reviews;
      fav_wines = res.data.fav_wines;
      wine_reviews = res.data.wine_reviews;
      populateWineResults(wines, favs, reviews, fav_wines, wine_reviews)

    } else if (target.tagName == "svg") {
      const button = target.parentElement.parentElement;
      let wineId = button.dataset.id;
      const res = await axios.get(`/user/reviews/${wineId}/delete`)
      const wine_results = await axios.get(`/wine_style/""`)
      wines = wine_results.data.wine_results;
      favs = wine_results.data.user_favorites;
      reviews = wine_results.data.reviews;
      fav_wines = res.data.fav_wines;
      wine_reviews = res.data.wine_reviews;
      populateWineResults(wines, favs, reviews, fav_wines, wine_reviews)

    }

})


// =================================================  TOGGLE OPEN SORT BY OPTIONS / RESULTS PAGE  ================================================

$("#choose-wine-type").on("click", function(e) {
  $("#wine-type-checkboxes").toggleClass("hidden")
})

$("#choose-wine-style").on("click", function(e) {
  $("#wine-style-checkboxes").toggleClass("hidden")
})

$("#choose-sort-by").on("click", function(e) {
  $("#sort-by-checkboxes").toggleClass("hidden")
})
// =================================================  CLICK EVENT FOR WINE OPTIONS / RESULTS PAGE  ================================================

$("#wine-type-checkboxes").on("click", ".panel-block", async function(e) {
  const target = e.target;

  if (target.tagName == "INPUT") {
    const filterName = target.nextSibling.data;
    const targetInput = target.parentElement.firstElementChild;
    // $(targetInput).toggleClass("is-focused")
    $(targetInput).toggleClass("is-light")
    const res = await axios.get(`/wine_type/${filterName}`)
    const wine_results = await axios.get(`/wine_style/""`)
    wines = wine_results.data.wine_results;
    favs = wine_results.data.user_favorites;
    reviews = wine_results.data.reviews;
    populateWineResults(wines, favs, reviews)

  }

})

$("#wine-style-checkboxes").on("click", ".panel-block", async function(e) {
  const target = e.target;

  if (target.tagName == "INPUT") {
    const filterName = target.nextSibling.data;
    const targetInput = target.parentElement.firstElementChild;
    // $(targetInput).toggleClass("is-focused")
    $(targetInput).toggleClass("is-light")
    const wine_results = await axios.get(`/wine_style/${filterName}`)
    wines = wine_results.data.wine_results;
    favs = wine_results.data.user_favorites;
    reviews = wine_results.data.reviews;

    populateWineResults(wines, favs, reviews)

  }

})


$("#sort-by-checkboxes").on("click", ".panel-block", async function(e) {
  const target = e.target;

  if (target.tagName == "INPUT") {
    const filterName = target.nextSibling.data;
    const targetInput = target.parentElement.firstElementChild;
    // $(targetInput).toggleClass("is-focused")
    $(targetInput).toggleClass("is-light")
    const res = await axios.get(`/sort_by/${filterName}`)
    const wine_results = await axios.get(`/wine_style/""`)
    wines = wine_results.data.wine_results;
    favs = wine_results.data.user_favorites;
    reviews = wine_results.data.reviews;
    populateWineResults(wines, favs, reviews)

  }

})

// =================================================  LOADING VARIETALS / RESULTS PAGE ================================================


$("#varietals-button").on("click", async function() {
  varietalDiv = $("#varietals")
  varietalDiv.html("")
  const items = await axios.get('/get_varietals')
  varietal_array = items.data.varietals;
  selected_varietals = items.data.selected_varietals;
  makeModal(varietal_array, selected_varietals)
  modal = $(".modal");
  modal.toggleClass("is-active")
})


$(".modal").on("click", ".delete", function() {
  modal = $(".modal");
  modal.toggleClass("is-active")
})

function makeModal(varietal_array, selected_varietals) {

for (varietal of varietal_array) {
  if (selected_varietals.includes(varietal)) {
    html = `<button class="button is-info is-rounded mt-3 mb-2 mx-2 wine-type varietals">${varietal}</button>`
    varietalDiv.append(html);
  } else {
    html = `<button class="button is-info is-light is-rounded mt-3 mb-2 mx-2 wine-type varietals">${varietal}</button>`
    varietalDiv.append(html);
  }

}
}


// =================================================  PICKING VARIETALS / RESULTS PAGE  ================================================




$("#choose-varietals").on("click", async function() {
  varietalDiv = $("#varietals-modal")
  varietalDiv.html("")
  const items = await axios.get('/get_varietals')
  varietal_array = items.data.varietals;
  selected_varietals = items.data.selected_varietals;
  makeModal(varietal_array, selected_varietals)
  modal = $(".modal");
  modal.toggleClass("is-active")
})



$("#varietals-modal").on("click", ".varietals", async function(e) {
  const target = e.target;
  const targetName = target.innerText;

  // target.classList.toggle("is-focused")
  target.classList.toggle("is-light")

  await sendVarietals(targetName)
})


$("#modal").on("click", ".toggle-off", async function() {
  modal = $(".modal");
  modal.toggleClass("is-active")

  const wine_results = await axios.get(`/wine_style/""`)
  wines = wine_results.data.wine_results;
  favs = wine_results.data.user_favorites;
  reviews = wine_results.data.reviews;
  populateWineResults(wines, favs, reviews)

})


// =================================================  CALLING API  ================================================

async function makeAPIcall() {
  await axios.get("/api/get_red_wines")
  await axios.get("/api/get_white_wines")
  await axios.get("/api/get_rose_wines")

}
async function getReds() {
  await axios.get("/api/get_red_wines")


}

async function getWhites() {
  await axios.get("/api/get_white_wines")

}

async function getRose() {
  await axios.get("/api/get_rose_wines")

}





  
    

