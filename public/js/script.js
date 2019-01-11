let moviesList=[];
let favouriteMovies=[];

function getMovies() {
	return fetch('http://localhost:3000/movies').then(response =>{
     
      if(response.ok){         
              return response.json();          
      }
      else if(response.status == 404){
          return Promise.reject(new Error('Invalid URL'))
      }
      else if(response.status == 401){
          return Promise.reject(new Error('UnAuthorized User...'));
      }
      else{
          return Promise.reject(new Error('Some internal error occured...'));
      }
  }).then(moviesResponse =>{
       moviesList = moviesResponse;  
     displaymoviesList(moviesList);
		return moviesResponse;
}).catch(error =>{ 
     const errorEle = document.getElementById('error');
    errorEle.innerHTML = `<h5 style='color:red'>${error.message}</h5>`
      
  })
    
}

function addFavourite(id) {
    let movieName = moviesList.find(movie =>{
        if(movie.id == id){
            return movie;
        }
    });
    let favExists = favouriteMovies.find(favMovie => {
        if( favMovie.id == movieName.id ){
            return favMovie;
        }
    });
    if(favExists) {
        return Promise.reject(new Error('Movie is already added to favourites'));
    }else{
         return fetch(`http://localhost:3000/favourites`,{
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(movieName)
         }
         ).then(response => {
                 if(response.ok){
                     return response.json();
                 }
             }
         ).then(addedMovie => {
                 favouriteMovies.push(addedMovie);
                 displayFavouriteMovies(favouriteMovies);
                 return favouriteMovies;
             }
         )
     }
 }
 
 function displaymoviesList(moviesList){
     const ulEle =   document.getElementById('moviesList');
     let ulHtmlString = '';
     
     moviesList.forEach(movie => {
         ulHtmlString += `
    <li>${movie.id}</li>
               Title<li>${movie.title}</li>
        <img src='${movie.posterPath}' />
        <li><button class='btn btn-primary' onclick='addFavourite(${movie.id})'style='background-color:pink;color
        :black'>Add to favorite</button><li>
         `
     });
 
     ulEle.innerHTML = ulHtmlString;
 }
 
 function displayFavouriteMovies(favouriteMovies){
     //DOM manipulation
     const ulEle =   document.getElementById('favouritesList');
     let ulHtmlString = '';
     
     favouriteMovies.forEach(movie => {
         ulHtmlString += `
      <li>${movie.id}</li>
               <li>${movie.title}</li>
               <img src='${movie.posterPath}' />
         `
     });
 
     ulEle.innerHTML = ulHtmlString;
 }
 function getFavourites() {
     return fetch('http://localhost:3000/favourites').then(response =>{
           if(response.ok){
                   return response.json();
           }
           else if(response.status == 404){
               return Promise.reject(new Error('Invalid URL'))
           }
           else if(response.status == 401){
               return Promise.reject(new Error('UnAuthorized User...'));
           }
           else{
               return Promise.reject(new Error('Internal Server Error'));
           }}).then(favouriteMoviesResponse =>{
             favouriteMovies = favouriteMoviesResponse;
             displayFavouriteMovies(favouriteMovies);
             return favouriteMoviesResponse;
         }).catch(error =>{
             const errorEle = document.getElementById('errorFavouriteMovie');
             errorEle.innerHTML = `<h2 style='color:red'>${error.message}</h2>`
             return error;
           }
       )
 }
 module.exports = {
    getMovies,
    getFavourites,
    addFavourite
};
 