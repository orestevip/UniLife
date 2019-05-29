const libriList = document.querySelector('#lista-libri');
const libriForm = document.querySelector('#add-book-form');
const libriTable = document.getElementById('libri-table');

function addRow(doc) {
    let newRow = libriTable.insertRow(-1);

    let newCell = newRow.insertCell(0);
    let newAuthcell = newRow.insertCell(1);
    let newSubjcell = newRow.insertCell(2);

    let newText = document.createTextNode(doc.data().Nome);
    let newAuthText = document.createTextNode(doc.data().Autore);
    let newSubjText = document.createTextNode(doc.data().Materia);

    newCell.appendChild(newText);
    newAuthcell.appendChild(newAuthText);
    newSubjcell.appendChild(newSubjText);
}

function renderLibri(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let subject = document.createElement('span');
    let author = document.createElement('span');

    let cross = document.createElement('button');

    li.setAttribute('libro-id', doc.id);
    name.textContent = doc.data().Nome + ' - ';
    author.textContent = doc.data().Autore + ' - ';
    subject.textContent = doc.data().Materia + ' -------------->';
    cross.textContent = 'X';

    li.appendChild(name);
    li.appendChild(author);
    li.appendChild(subject);
    li.appendChild(cross);

    libriList.appendChild(li);

    ///delete data from db
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = doc.id;
        firestore.collection('libri').doc(id).delete();
    })
}

//initialize db
const firestore = firebase.firestore();

// firestore.collection('libri').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderLibri(doc);
//     })
// });

libriForm.addEventListener('submit', (e) => {
    e.preventDefault();
    firestore.collection('libri').doc(libriForm.codLibro.value).set({
        Nome: libriForm.nomeLibro.value,
        Autore: libriForm.autoreLibro.value,
        Materia: libriForm.materiaLibro.value,
    });
});

///realtime update
firestore.collection('libri').orderBy('Nome').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type === 'added') {
            renderLibri(change.doc);
            addRow(change.doc);
        } else if(change.type === 'removed') {
            let li = libriList.querySelector('[libro-id=' + change.doc.id + ']');
            libriList.removeChild(li);
        }
    })
});


/*
let result = document.getElementById('resultID');
let submitButton = document.getElementById('submitButton');
let showButton = document.getElementById('showButton');
let nomeLibro = document.getElementById('NomeLibro');
let autoreLibro = document.getElementById('AutoreLibro');

submitButton.addEventListener("click", function() {
    const nameToSave = nomeLibro.innerText;
    const authToSave = autoreLibro.innerText;
    firebase.database().ref('libri/' + codLibro).set({
        nome: nameToSave,
        autore: authToSave,
    });
});

showButton.addEventListener("click", function() {
    firebase.database().ref('libri/MAT-12345').get().then(function (doc) {
        if(doc && doc.exists) {
            const mydata = doc.data();
            result.innerText = "Nome: " + mydata.Nome + " - Autore: " + mydata.Autore;
        }
    });
});

*/

