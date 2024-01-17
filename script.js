document.addEventListener("DOMContentLoaded", () => {
  const characterList = document.getElementById("characterList");
  const genderFilter = document.getElementById("genderFilter");
  const firstPageBtn = document.getElementById("firstPage");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const lastPageBtn = document.getElementById("lastPage");
  const currentPageSpan = document.getElementById("currentPage");
  const charactersPerPageInfo = document.getElementById("charactersPerPage");

  const charactersPerPage = 20; //& MUESTRA CHARACTERS POR PAGE
  let currentPage = 1;
  let totalCharacters = 0;
  let currentGender = ""; //! ALMACENA GÉNERO

  async function fetchCharacters(page) {
    //^ FUNCIÓN ASINCRÓNICA PARA LEER LA API
    try {
      let apiUrl = `https://rickandmortyapi.com/api/character/?page=${page}`;

      if (currentGender) {
        apiUrl += `&gender=${currentGender}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();
      totalCharacters = data.info.count;
      const characters = data.results;
      displayCharacters(characters);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  } //^ FIN DE FUNCIÓN PARA LEER LA API

  function displayCharacters(characters) {
    //& FUNCIÓN QUE ENCUADRA LOS ELEMENTOS CHARACTERS
    characterList.innerHTML = "";
    characters.forEach((character) => {
      const characterDiv = document.createElement("div");
      characterDiv.className = "character";
      characterDiv.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <h3>${character.name}</h3>
                <p>Gender: ${character.gender}</p>
                <p>Spice: ${character.species}</p>
                <p>Status: ${character.status}</p>
                <p>Origin: ${character.origin.name}</p>
                <p>Location: ${character.location.name}</p>
                <button> SHOW MORE </button>
            `;
      characterList.appendChild(characterDiv);
    });
    updatePaginationButtons();
  } //& FIN DE LA FC QUE ENCUADRA LOS ELEMENTOS

  function updatePaginationButtons() {
    //? FUNCIÓN PARA BUTTONS DE PAGINADO
    const totalPages = Math.ceil(totalCharacters / charactersPerPage);

    firstPageBtn.disabled = currentPage === 1;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
    lastPageBtn.disabled = currentPage === totalPages;

    currentPageSpan.textContent = `${currentPage} / ${totalPages}`;

    // const startIndex = (currentPage - 1) * charactersPerPage + 1;
    const endIndex = Math.min(currentPage * charactersPerPage, totalCharacters);
    charactersPerPageInfo.textContent = `SHOW ${endIndex} CHARACTERS`;
  } //? FIN DE FC PARA LOS BUTTONS DEL PAGINADO

  function changePage(newPage) {
    //* FC CAMBIAR PÁGINA, LLAMA A LA PRIMERA ASYNC
    currentPage = newPage;
    fetchCharacters(currentPage);
  } //* FIN DE FC QUE CAMBIA DE PAGINA

  async function filterCharactersByGender() {
    //~ BUSCAR POR GENDER Y VUELVE A PRIMERA PAGINA
    currentGender = genderFilter.value.toLowerCase();
    fetchCharacters(1);
  } //~FIN DE FC, SOLO SE USA AL FILTRAR POR GENDER

  //! eventos de click en los botones de paginación:
  firstPageBtn.addEventListener("click", () => changePage(1));
  prevPageBtn.addEventListener("click", () => changePage(currentPage - 1));
  nextPageBtn.addEventListener("click", () => changePage(currentPage + 1));
  lastPageBtn.addEventListener("click", () =>
    changePage(Math.ceil(totalCharacters / charactersPerPage))
  );

  genderFilter.addEventListener("change", filterCharactersByGender);

  fetchCharacters(currentPage);
});
