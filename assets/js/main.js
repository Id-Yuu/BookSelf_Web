"use strict";
const books = [];
const RENDER_EVENT = "renderBook";
const SAVED_EVENT = "SavedBooks";
const STORAGE_KEY = "BookSelfApps";

function setDataBuku(id, title, author, number, status) {
  return {
    id: id,
    title: title,
    author: author,
    year: number,
    isCompleted: status,
  };
}

function cekStorage() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

const createUid = () => {
  return +new Date();
};

function cariBuku(id) {
  for (const cari of books) {
    if (cari.id === id) {
      return cari;
    }
  }
  return null;
}

function cariBukuIndex(bookId) {
  for (const i in books) {
    if (books[i].id === bookId) {
      return i;
    }
  }
  return -1;
}

function saveData() {
  if (cekStorage()) {
    const historiLog = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, historiLog);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function getDataFromLocalStorage() {
  const storageLogs = localStorage.getItem(STORAGE_KEY);
  let datas = JSON.parse(storageLogs);
  if (datas !== null) {
    for (const datax of datas) {
      books.push(datax);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function listBuku(params) {
  const element = document.createElement("h3");
  element.innerText = params.title;

  const style = document.createElement("p");
  style.innerText = `Penulis : ${params.author}`;

  const button = document.createElement("p");
  button.innerText = `Tahun : ${params.year}`;

  const d = document.createElement("div");
  d.classList.add("action");

  const cb = document.createElement("article");
  cb.classList.add("book_item");

  cb.append(element, style, button, d);
  cb.setAttribute("id", `book-${params.id}`);

  if (params.isCompleted) {
    const notificationEl = document.createElement("button");
    notificationEl.classList.add("green");

    notificationEl.innerText = "Belum selesai di baca";
    notificationEl.addEventListener("click", () => {
      return setEditStatusNotComplete(params.id);
    });

    const item = document.createElement("button");
    item.classList.add("red");
    item.innerText = "Hapus Buku";
    item.addEventListener("click", () => {
      return hapusStatusFromComplete(params.id);
    });

    const edit = document.createElement("button");
    edit.classList.add("blue");
    edit.innerText = "Edit Buku";
    edit.addEventListener("click", () => {
      const judul = document.getElementById("inputBookTitle");
      judul.value = params.title;
      const penulis = document.getElementById("inputBookAuthor");
      penulis.value = params.author;
      const tahun = document.getElementById("inputBookYear");
      tahun.value = params.year;
      if (params.isCompleted) {
        document.getElementById("inputBookIsComplete").checked = true;
      }
      if (!params.isCompleted) {
        document.getElementById("inputBookIsComplete").checked = false;
      }
      const editBtn = document.getElementById("bookSubmit");
      editBtn.innerText = "Edit Buku";
      const dataEdit = setDataBuku(judul, penulis, tahun, params.isCompleted);
      books.pop(dataEdit);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    });

    d.append(notificationEl, item, edit);
  } else {
    const notificationEl = document.createElement("button");
    notificationEl.classList.add("green");

    notificationEl.innerText = "Selesai Dibaca";
    const item = document.createElement("button");
    item.classList.add("red");

    item.innerText = "Hapus buku";
    item.addEventListener("click", () => {
      return hapusStatusFromComplete(params.id);
    });
    notificationEl.addEventListener("click", () => {
      return setStatusComplete(params.id);
    });

    const edit2 = document.createElement("button");
    edit2.classList.add("blue");
    edit2.innerText = "Edit Buku";
    edit2.addEventListener("click", () => {
      const judul = document.getElementById("inputBookTitle");
      judul.value = params.title;
      const penulis = document.getElementById("inputBookAuthor");
      penulis.value = params.author;
      const tahun = document.getElementById("inputBookYear");
      tahun.value = params.year;
      if (params.isCompleted) {
        document.getElementById("inputBookIsComplete").checked = true;
      }
      if (!params.isCompleted) {
        document.getElementById("inputBookIsComplete").checked = false;
      }
      const editBtn = document.getElementById("bookSubmit");
      editBtn.innerText = "Edit Buku";
      const dataEdit = setDataBuku(judul, penulis, tahun, params.isCompleted);
      books.pop(dataEdit);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    });

    d.append(notificationEl, item, edit2);
  }
  return cb;
}

const cekStatus = document.getElementById("inputBookIsComplete");
cekStatus.addEventListener("click", () => {
  return cekStatus.checked
    ? (document.getElementById("belum-dibaca").innerText = "Selesai Dibaca")
    : (document.getElementById("belum-dibaca").innerText = "Belum Dibaca");
});

function cariJudulBuku() {
  const cariById = document
    .getElementById("searchBookTitle")
    .value.toLocaleLowerCase();
  const tds = document.getElementsByClassName("book_item");
  for (let i = 0; i < tds.length; i++) {
    let headArray = tds[i].getElementsByTagName("h3");
    if (headArray[0].innerHTML.toLocaleLowerCase().indexOf(cariById) > -1) {
      tds[i].style.display = "";
    } else {
      tds[i].style.display = "none";
    }
  }
}

function simpanBuku() {
  const setJudul = document.getElementById("inputBookTitle").value;
  const setAuthor = document.getElementById("inputBookAuthor").value;
  const setTahun = document.getElementById("inputBookYear").value;
  const setStatusBuku = document.getElementById("inputBookIsComplete").checked;
  const setUidBuku = createUid();
  const tahunNumber = Number.parseInt(setTahun);

  if (!tahunNumber == true) {
    console.warn("Error Tahun Bukan Type Data Number");
  }

  const input_data_buku = setDataBuku(
    setUidBuku,
    setJudul,
    setAuthor,
    tahunNumber,
    setStatusBuku
  );
  books.push(input_data_buku);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function setStatusComplete(text_label_id) {
  const countdown = cariBuku(text_label_id);
  if (countdown == null) {
    return;
  }
  countdown.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function hapusStatusFromComplete(bookHome) {
  const bookIndex = cariBukuIndex(bookHome);
  if (bookIndex === -1) {
    return;
  }
  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function setEditStatusNotComplete(text_label_id) {
  const countdown = cariBuku(text_label_id);
  if (countdown == null) {
    return;
  }
  countdown.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// DOM
document.addEventListener("DOMContentLoaded", function () {
  const el_form_login_form = document.getElementById("inputBook");
  el_form_login_form.addEventListener("submit", function (event) {
    event.preventDefault();
    simpanBuku();
  });
  if (cekStorage()) {
    getDataFromLocalStorage();
  }
  const smtpForm = document.getElementById("searchBook");
  smtpForm.addEventListener("submit", function (event) {
    event.preventDefault();
    cariJudulBuku();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const elm = document.getElementById("incompleteBookshelfList");

  elm.innerHTML = "";
  const details = document.getElementById("completeBookshelfList");

  details.innerHTML = "";
  for (const status of books) {
    const value = listBuku(status);
    if (!status.isCompleted) {
      elm.append(value);
    } else {
      details.append(value);
    }
  }
});
