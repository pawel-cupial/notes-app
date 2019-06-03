const getSavedNotes = () => {
    const notesJSON = localStorage.getItem('notes')//Zapisuje w notesJSON dane z local storage, które wcześniej były zapisane pod kluczem "notes"
    if (notesJSON !== null) { //Zwraca dane z local storage jeśli local storage nie jest pusty 
        return JSON.parse(notesJSON)
    } else {
        return []//Jeśli local storage jest pusty, zwraca pustą tablicę
    }
}

const saveNotes = (notes) => {//Konwertuje obiekty w tablicy do formatru JSON i zapisuje je w local storage
    localStorage.setItem('notes', JSON.stringify(notes))
}

const removeNote = (id) => {
    const noteIndex = notes.findIndex((note) => note.id === id) //Iteruje przez całą tablicę "notes" i zwraca indeks notki, która spełniła warunek, jeśli żadna notka nie spełniła warunku zwraca -1
     //Zwraca indeks notki, której id jest równe id notki wywołanej przez kliknięcie w button z event listenerem(patrz button.addEventListener poniżej)

    if(noteIndex > -1) {
        notes.splice(noteIndex, 1)//Usuwa notkę, która spełniła powyższy warunek. Pierwszy argument to id notki, drugi ilość elementów do usunięcia.
    }
}

const generateNoteDOM = (note) => {
    const noteEl = document.createElement('div')
    const textEl = document.createElement('a')
    if (note.title.length > 0) {//Jeśli notka nie ma ustawionego tytułu, w miejsce tytułu wstawiany jest tekst "Unnamed note"
        textEl.textContent = note.title
    } else {
        textEl.textContent = 'Unnamed note'
    }
    textEl.setAttribute('href',`edit.html#${note.id}`)//Nadaje stworzonemu linkowi atrybut href z wartością edit.html + unikalne id każdej utworzonej notki. Dzięki temu każda notka będzie miała osobną stronę edycji

    const button = document.createElement('button')
    button.textContent = 'x'

    noteEl.appendChild(button)
    button.addEventListener('click', (e) => {
    //W tym miejscu jest już dostęp do indywidualnego id każdej notki. Każdy button odpowiada notce, z którą jest w divie
        removeNote(note.id)//Podtsawia do funkcji removeNote id konkretnej notki
        saveNotes(notes)//Zapisuje tablicę w local storage już bez usuniętej notki
        renderNotes(notes, filters)//Renderuje DOM po każdym usunięciu notki
    })
    noteEl.appendChild(textEl)

    return noteEl
}

const sortNotes = (notes, sortBy) => {
    if (sortBy === 'byEdited') {
        return notes.sort((a,b) => {
            if (a.updatedAt > b.updatedAt) {
                return -1
            } else if (a.updatedAt < b.updatedAt) {
                return 1
            } else {
                return 0
            }
        })
    } else if (sortBy === 'byCreated') {
        return notes.sort((a,b) => {
            if (a.createdAt > b.createdAt) {
                return -1
            } else if (a.createdAt < b.createdAt) {
                return 1
            } else {
                return 0
            }
        })
    } else if (sortBy === 'alphabetical') {
        return notes.sort((a,b) => {
            if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return -1
            } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
                return 1
            } else {
                return 0
            }
        })
    } else {
        return notes
    }
}
/*można odwołać się do notes i filters bezpośrednio w funkcji. Dzięki ustawieniu notes i filters 
jako argumentów, funkcję można zastosować do innej tablicy notatek i innych filtrów.*/
const renderNotes = (notes, filters) => {
    notes = sortNotes(notes, filters.sortBy)//Zapisuje w tablicy "notes" notki w kolejności zwróconej przez funkcję sortNotes 
    const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(filters.serachText.toLowerCase()))
     //Zwraca tablicę notatek, których tytuły zawierają treść filtra i zapisuje ją w FilteredNotes

    document.querySelector('#notes').innerHTML = ''//Czyści cały div id=notes przed renderowaniem, żeby notatki się nie powielały

    filteredNotes.forEach((note) => {//Iteruje przez tablicę filteredNotes i renderuje html dla każdej wyfiltorwanej notki
        const noteEl = generateNoteDOM(note)//Zwraca dane z funkcji generateNoteDOM
        document.querySelector('#notes').appendChild(noteEl)
    })
}
