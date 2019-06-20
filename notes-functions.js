const getSavedNotes = () => {
    const notesJSON = localStorage.getItem('notes')//Zapisuje w notesJSON dane z local storage, które wcześniej były zapisane pod kluczem "notes"
    try {
        if (notesJSON) { //Zwraca dane z local storage jeśli local storage nie jest pusty 
            return JSON.parse(notesJSON)
        } else {
            return []//Jeśli local storage jest pusty, zwraca pustą tablicę
        }
    } catch (e) {//W razie błędów w kodzie w try, dzięki wyrażeniu catch zwrócona zostanie pusta tablica (np. jeśli notki w local storage będą w niepoprawnym formacie)
        return []
    }
}

const saveNotes = (notes) => {//Konwertuje obiekty w tablicy do formatru JSON i zapisuje je w local storage
    localStorage.setItem('notes', JSON.stringify(notes))
}

const removeNote = (id) => {
    const noteIndex = notes.findIndex((note) => note.id === id) //Iteruje przez całą tablicę "notes" i zwraca indeks notki, która spełniła warunek, jeśli żadna notka nie spełniła warunku zwraca -1
     //Zwraca indeks notki, której id jest równe id notki wywołanej przez kliknięcie w button z event listenerem(patrz button.addEventListener poniżej)

    if(noteIndex > -1) {
        notes.splice(noteIndex, 1)//Usuwa notkę, która spełniła powyższy warunek. Pierwszy argument to indeks notki, drugi ilość elementów do usunięcia.
    }
}

const generateNoteDOM = (note) => {
    const noteEl = document.createElement('a')
    noteEl.classList.add('list-item')
    const textEl = document.createElement('p')
    textEl.classList.add('list-item__title')
    const statusEl = document.createElement('p')
    statusEl.classList.add('list-item__subtitle')

    if (note.title.length > 0) {//Jeśli notka nie ma ustawionego tytułu, w miejsce tytułu wstawiany jest tekst "Unnamed note"
        textEl.textContent = note.title
    } else {
        textEl.textContent = 'Unnamed note'
    }
    noteEl.appendChild(textEl)
    noteEl.setAttribute('href',`edit.html#${note.id}`)//Nadaje stworzonemu linkowi atrybut href z wartością edit.html + unikalne id każdej utworzonej notki. Dzięki temu każda notka będzie miała osobną stronę edycji
    
    statusEl.textContent = `Last edited ${moment(note.updatedAt).fromNow()}`
    noteEl.appendChild(statusEl)
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
    if(filteredNotes.length > 0) {
        filteredNotes.forEach((note) => {//Iteruje przez tablicę filteredNotes i renderuje html dla każdej wyfiltorwanej notki
            const noteEl = generateNoteDOM(note)//Zwraca dane z funkcji generateNoteDOM
            document.querySelector('#notes').appendChild(noteEl)
        })
    } else {
        const emptyMessage = document.createElement('p')
        emptyMessage.textContent = 'No notes to show'
        emptyMessage.classList.add('empty-message')
        document.querySelector('#notes').appendChild(emptyMessage)
    }
}
