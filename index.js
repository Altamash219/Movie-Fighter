// http://www.omdbapi.com/?apikey=[yourkey]&
//  API KEY :b38f41fe

const autocompleteConfig = {
    renderOption(movie){
    const imgSrc = movie.Poster==="N/A" ? "": movie.Poster
    return `
    <img src = "${imgSrc}"/>
    ${movie.Title}
`
},
inputValue(movie){
    return`${movie.Title}`
},
async fetchData(searchTerm){
    const response = await axios.get("http://www.omdbapi.com/",{
        params:{
            apikey : "b38f41fe",
            s : searchTerm
        }
    });
    // console.log(response)
    if(response.data.Error){
        return [];
    }
    else{
    return response.data.Search;
    }
}

};

createAutoComplete({
    ...autocompleteConfig,
    root : document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSearch(movie, document.querySelector('#left-summary'),'left')
},
})
createAutoComplete({
    ...autocompleteConfig,
    root : document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSearch(movie, document.querySelector('#right-summary'), 'right')
},
})

let leftMovie 
let rightMovie
const onMovieSearch = async(movie, summaryTarget, side)=>{
    const response = await axios.get("http://www.omdbapi.com/",{
        params:{
            apikey : "b38f41fe",
            i : movie.imdbID
        }
    }) 
    // console.log(response.data)
    summaryTarget.innerHTML = movieTemplate(response.data)
   
    if(side === 'left'){
        leftMovie = response.data
    }else{
        rightMovie=response.data
    }

    if(leftMovie && rightMovie){
        runComparison()
    }
}
const runComparison = ()=>{
    const leftSideStat = document.querySelectorAll('#left-summary .notification')
    const rightSideStat = document.querySelectorAll('#right-summary .notification')

    leftSideStat.forEach((leftStat, idx)=>{
        const rightStat = rightSideStat[idx];

        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;
        if(parseFloat(rightSideValue) >parseFloat(leftSideValue)){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning')
        }else{
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning')
        }
    })
}


const movieTemplate = movieDetail=>{
    // const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore)
    const imdbRatings = parseFloat(movieDetail.imdbRating)
    const imdbvote = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))   
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        if(isNaN(value)){
            return prev;
        }else{
            return prev + value;
        }
        
    },0);
    return `
     <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src= "${movieDetail.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
             <h1>${movieDetail.Title}</h1>
             <h4>${movieDetail.Genre}</h4>
             <p>${movieDetail.Plot}</p>
            </div>
        </div>
     </article>
     <article data-value = ${awards} class = "notification is-primary">
      <p class = "title">${movieDetail.Awards}</p>
      <p class = "subtitle">Awards</p>
     </article>
     
     <article data-value = ${metascore} class = "notification is-primary">
      <p class = "title">${movieDetail.Metascore}</p>
      <p class = "subtitle">Metascore</p>
     </article>
     <article data-value = ${imdbRatings} class = "notification is-primary">
      <p class = "title">${movieDetail.imdbRating}</p>
      <p class = "subtitle">imdbRating</p>
     </article>
     <article data-value = ${imdbvote} class = "notification is-primary">
      <p class = "title">${movieDetail.imdbVotes}</p>
      <p class = "subtitle">imdbVotes</p>
     </article>
    `;
}