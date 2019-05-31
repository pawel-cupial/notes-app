const titleElement = document.querySelector('#note-title')
const bodyElement = document.querySelector('#note-body')
const removeElement = document.querySelector('#remove-note')
const dateElement = document.querySelector('#last-edited')
const noteId = location.hash.substring(1)//Zapisuje w noteId id notki pobrany z adresu URL(location.hash).
/*Substring przyjmuje 2 argumenty - numer indeksu, od którego zaczyna się cięcie i liczbę znaków, które mają być zawarte w uciętym stringu.
W powyższym przykładzie ucięty ma być tylko "#" z początku adresu URL(), dlatego nie trzeba podawać drugiego argumentu*/
let notes = getSavedNotes()//Pobiera notatki z local storage i zapisuje je w "notes"
let note = notes.find(function (note) {
    return note.id === noteId//Sprawdza czy id edytowanej notki zgadza się z id pobranym z adresu URL. Jeśli nie, przenosi użytkownika z powrotem na stronę startową
})
if (note === undefined) {
    location.assign('index.html')
}

titleElement.value = note.title
bodyElement.value = note.body
dateElement.textContent = `Last edited ${moment(note.updatedAt).fromNow()}`
/*Powyższe 2 linijki ustawiają domyślną wartość inputów odpowiednio na tytuł notki i tekst notki. Np. jeśli użytkownik na głównej stronie kliknie w notkę o tytule
"notatka", to po przejściu na stronę edycji w inpucie zamiast placeholdera będzie widniał tytuł "notatka", to samo z body. Trzecia linijka wstawia w span informację o tym,
ile czasu temu notka była edytowana.  */

titleElement.addEventListener('input', function (e) {
    note.title = e.target.value//Ustawia tytuł notki na wartość podaną przez użytkownika w inpucie
    note.updatedAt = moment().valueOf()//Funkcje z biblioteki "Moment JS". Aktualizuje informację kiedy notka była edytowana
    dateElement.textContent = `Last edited ${moment(note.updatedAt).fromNow()}`
    saveNotes(notes)
})

bodyElement.addEventListener('input', function (e) {
    note.body = e.target.value//To samo co powyżej tylko z body
    note.updatedAt = moment().valueOf()//Funkcje z bilbiotki "Moment JS"
    dateElement.textContent = `Last edited ${moment(note.updatedAt).fromNow()}`
    saveNotes(notes)
})

removeElement.addEventListener('click', function (e) {
    removeNote(note.id)
    saveNotes(notes)
    location.assign('index.html')//Po usunięciu notki przenosi użytkownika z powrotem na stronę główną.
})


/*Poniższy kod zapewnia synchornizację danych na wszystkich kartach. Np. jeśli będę miał otwartą stronę edycji notek na dwóch osobnych kartach
i na jednej z nich zmienię tytuł notki, tytuł tej notki na drugiej karcie będzie automatycznie aktualizowany. Obiekt window jest na szczycie hierarchii obiektów,
reprezentuje okno przeglądraki. W poniższym wypadku użyte są 3 własności eventu storage: key, oldValue i newValue*/
window.addEventListener('storage', function(e) {
    if (e.key === 'notes') {//Sprawdza czy zmiany były dokonane na kluczu "notes". W tym projekcie nie ma kluczy innych niż "notes" więc warunek jest tylko demonstracyjny
        notes = JSON.parse(e.newValue)//Pobiera nową wartość z local storage i aktualizuje tablicę z notkami
    }
    let note = notes.find(function (note) {
        return note.id === noteId//Sprawdza czy id edytowanej notki zgadza się z id pobranym z adresu URL. Jeśli nie, przenosi użytkownika z powrotem na stronę startową
    })
    if (note === undefined) {
        location.assign('index.html')
    }
    
    titleElement.value = note.title
    bodyElement.value = note.body
    dateElement.textContent = `Last edited ${moment(note.updatedAt).fromNow()}`
})