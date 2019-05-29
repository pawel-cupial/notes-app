const notes = getSavedNotes()//Tworzy tablicę notes na podstawie danych zwróconych z funkcji getSavedNotes (dane z local storage albo pustą tablicę)

const filters = {
    serachText: ''
}

renderNotes(notes, filters)//Pierwotne renderowanie. Bez tego wezwania do czasu wpisania czegokolwiek w inpucie na stronie nie pojawiałyby się żadne notki.

document.querySelector('#create-note').addEventListener('click', function(e) {
    const id = uuidv4()//Zaspiuje unikalny identyfikator w zmiennej "id". Następnie trzeba odwołać się do tej zmiennej w kluczu id oraz w adresie URL w location.assign
    notes.push({
        id: id, 
        title: '', 
        body: ''})//Dodaje do tablicy "notes" obiekt o kluczach "title", "body" i "id"
    saveNotes(notes)//Zapisuje tablicę "notes" w local storage
    //W localStorage.setItem zawsze trzeba podać dwa argumenty: klucz obiektu (w w/w przykładzie "notes") i wartość (w przykładzie cała tablica "notes", która została zamieniona w stringa)
    location.assign(`edit.html#${id}`)//Location to obiekt wbudowany. Metoda assign działa jak anchor. Po kliknięciu "create note" użytkownik zostanie automatycznie przeniesiony na stronę edit.html.
})


document.querySelector('#search-text').addEventListener('input', function(e) {
    filters.serachText = e.target.value//Zapisuje wartość z input id=search-text jako searchText w obieckie filters
    renderNotes(notes, filters)//Renderuje notki po każdej zmianie w inpucie
})

document.querySelector('#sort-by').addEventListener('change', function(e) {
    console.log(e.target.value)
})