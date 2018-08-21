console.log('hola');
 (async function load (){

 	async function getData(url){
 	const response = await fetch(url);
    const data = await response.json();
    if (data.data.movie_count > 0) {
      return data;
    }
    throw new Error('no se encontro ningun resultado');
  }
    const BASE_API = 'https://yts.am/api/v2/';

    function videoItemTemplate(movie, category) {
      return (
	    `
			<div class="playlist-item" data-id="${movie.id}" data-category="${category}">
		    <iframe class="playlist-video" width="350" height="200" src="" data-src="https://www.youtube.com/embed/${movie.yt_trailer_code}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
				<img src="${movie.medium_cover_image}" width="244" height="137">
		  </div>
		`
    )}

    function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }

  function renderMovieList(list, $container, category) {
    $container.children[0].remove();
    list.forEach((movie) => {
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
      
      const image = movieElement.querySelector('img');
      const video = movieElement.querySelector('iframe')
      
      movieElement.addEventListener('mouseenter', (event)=>{
        console.log(video); 
        video.setAttribute('src', video.dataset.src);
		    video.classList.remove('playlist-video');
      })
      movieElement.addEventListener('mouseleave', (event)=>{
        console.log(video);
		    video.classList.add('playlist-video');
      })
    })
  }
  async function cacheExist(category) {
    const listName = `${category}List`;
    const cacheList = window.localStorage.getItem(listName);
    if(cacheList) {
      return JSON.parse(cacheList);
    }
    const { data: { movies:data} } = await getData(`${BASE_API}list_movies.json?genre=${category}`)
    window.localStorage.setItem(listName, JSON.stringify(data))

    return data;
  }

  const actionList = await cacheExist('action');
  // window.localStorage.setItem('actionList', JSON.stringify(actionList));
  const $actionContainer = document.getElementById('action');
  renderMovieList(actionList, $actionContainer, 'action');

  const fantasyList = await cacheExist('fantasy');
  const $fantasyContainer = document.getElementById('fantasy');
  renderMovieList(fantasyList, $fantasyContainer, 'fantasy');

  const romanceList = await cacheExist('romance');
  const $romanceContainer = document.getElementById('romance');
  renderMovieList(romanceList, $romanceContainer, 'romace');

  const horrorList = await cacheExist('horror');
  const $horrorContainer = document.getElementById('horror');
  renderMovieList(horrorList, $horrorContainer, 'horror');

  const dramaList = await cacheExist('drama');
  const $dramaContainer = document.getElementById('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');

   function findById(list, id){
    return list.find(movie => movie.id === parseInt(id,10))
  }

   function findMovie(id, category){
    switch(category){
      case 'action': {
        return findById(actionList, id)
      }
      case 'fantasy': {
        return findById(comedyList, id)
      }
      case 'romance': {
        return findById(romanceList, id)
      }
      case 'horror': {
        return findById(horrorList, id)
      }
      default : {
        return findById(dramaList, id)
      }
    }
  }


 })();

const navigateBar =document.getElementById('navigate');
const video = document.getElementById('video');
const videoContainer = document.getElementById('video-container');

function allowPlay() {
    const canPlay = video.play();
    if (canPlay !== undefined) {
        canPlay
            .then(()=>{
                console.log('se pudo reproducir el video');
                // video.style.display = 'block';
                // pikachu.style.display = 'none';
            })
            .catch(()=> {
                console.log('no se pudo reproducir el video');
            })
    }
}

window.addEventListener('scroll', () => {
  if (window.scrollY >= 75){
    navigateBar.classList.add('navigate-color');
  }
  else{
    navigateBar.classList.remove('navigate-color');
  }
  if (window.scrollY <= window.innerHeight/2) {
        allowPlay();
  } else {
        video.pause();  
    }
})

 const searchIcon = document.getElementById('searchIcon');
 const form = document.getElementById('form');
 const inputForm =document.getElementById('inputForm');
// const formBar = getElementById('form');

 searchIcon.addEventListener('click', (event)=>{
  form.style.display='block';
  searchIcon.classList.remove('icon-search');
  inputForm.focus();
})

 form.addEventListener('click', (event)=>{
  event.stopPropagation();
  form.style.display='none';
  searchIcon.classList.add('icon-search');
})
form.addEventListener('submit', (event)=>{
  event.preventDefault();
  form.style.display='none';
  searchIcon.classList.add('icon-search');
  // form.classList.add('search-form');
})