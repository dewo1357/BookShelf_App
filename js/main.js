// Do your work here...
import { read_Data, StorageBookKey, deleteById, Sudah_Selesai, makeID, putdata, updateByValue, searchName, CheckStorage } from './bookManager.mjs';

const LoadData = () => {
    if (CheckStorage()) {
        const data = JSON.parse(localStorage.getItem(StorageBookKey));

        if (data !== null) {
            const belum_selesai = document.getElementById('incompleteBookList');
            belum_selesai.innerHTML = '';

            const selesai = document.getElementById('completeBookList');
            selesai.innerHTML = '';

            const jumlah_belum_selesai = document.getElementById("countNot");
            const jumlah_selesai = document.getElementById("countDone");

            let UnDone = 0;
            let Done = 0;
            for (let items of data) {
                let itemsElement = RenderData(items);
                if (items.isComplete === true) {
                    Done += 1
                    selesai.append(itemsElement);
                } else {
                    UnDone += 1;
                    belum_selesai.append(itemsElement);
                }
            }
            jumlah_belum_selesai.innerText = UnDone;
            jumlah_selesai.innerText = Done;
        }
    }
}


document.dispatchEvent(new Event(read_Data));
document.addEventListener(read_Data, function () {
    console.log(localStorage.getItem(StorageBookKey));
})


const RenderData = (data_items, search = 0) => {
    const dataTestId = [data_items.title, data_items.author, data_items.year];
    const test_id = ["bookItemTitle", "bookItemAuthor", "bookItemYear"]
    const label_title = ["Judul", "Penulis", "Year"]

    const section = document.createElement('div');


    //dijadikan satu kumpulan informasi

    const didalam_section = document.createElement('div');

    didalam_section.setAttribute('id', data_items.id);
    //tambahkan ini
    const didalam_section0 = document.createElement('div');
    didalam_section.setAttribute('class', 'componentDone ');

    const section2 = document.createElement('div');
    for (let index = 0; index < dataTestId.length; index++) {
        section2.setAttribute('data-bookid', data_items.id);
        section2.setAttribute('data-testid', "bookItem");
        let Element = null;
        if (index == 0) {
            Element = document.createElement('h3');
        } else {
            Element = document.createElement('p');
        }
        Element.setAttribute('data-testid', test_id[index]);

        Element.textContent = label_title[index] + ": " + dataTestId[index];
        section2.append(Element);
    }
    didalam_section.append(section2)


    const ButtonId = ["bookItemIsCompleteButton", "bookItemDeleteButton", "bookItemEditButton"];
    const data_id = ["bookFormTitleInput", "bookFormAuthorInput", "bookFormYearInput"];
    const image_name = ["aset/done-svgrepo-com.svg", "aset/icons8-delete-document-50.png", "aset/settings-svgrepo-com.svg"]

    const sectionButton = document.createElement('div')

    if (search == 0 || search == 2) {
        for (let i = 0; i < ButtonId.length; i++) {
            const button = document.createElement('button');
            button.setAttribute('data-testid', ButtonId[i]);
            button.setAttribute('id', "ButtonSetting");
            const images = document.createElement('img');

            //jika sudah selesai dibaca maka logo undo berubah menjadi logo X
            if (i == 0) {
                if (data_items.isComplete == true) {
                    images.setAttribute('src', 'aset/icons8-cancel-48.png')
                } else {
                    images.setAttribute('src', image_name[i]);
                }
            } else {
                images.setAttribute('src', image_name[i]);
            }

            images.setAttribute('width', '35');

            button.append(images);
            if (ButtonId[i] === "bookItemIsCompleteButton") {
                sectionButton.append(button);
                button.addEventListener('click', function () {
                    if (data_items.isComplete == false) {
                        Sudah_Selesai(data_items.id);
                    } else {
                        Sudah_Selesai(data_items.id, false);
                    }
                    LoadData();

                    //jika data yang dirender dari sumber search maka, apabila di klik, maka tombol tidak akan muncul lagi
                    if (search === 2) {
                        button.setAttribute('hidden', true);
                    }
                });
            } else if (ButtonId[i] === "bookItemDeleteButton") {
                sectionButton.append(button);
                button.addEventListener('click', function () {
                    let get_id = button.parentElement;
                    deleteById(data_items.id);
                    LoadData();
                    //value dari searchTitle dan SearchBookTittle Akan Hilang  jika di klik
                    if (search !== 0) {
                        document.getElementById("SearchTitle").innerHTML = "";
                        document.getElementById("searchBookTitle").value = "";
                        document.getElementById("searchSubmit2").setAttribute('hidden','')
                    };

                });

            } else {
                //tidak bisa di edit jika data di render dari sumber search
                sectionButton.append(button)
                button.addEventListener('click', function (event) {

                    let get_id = button.parentElement;
                    console.log(get_id.parentElement)

                    const form = document.createElement('form');

                    const overallsectionForm = document.createElement('div');
                    overallsectionForm.setAttribute('class', 'option')
                    form.setAttribute("id", "UpdateForm");

                    //inisialisasi div untuk form
                    const componentUpdate = document.createElement('div');
                    componentUpdate.setAttribute('class', 'label_input');
                    //kumpulan Element yang ingin di hidden;

                    const informasi = document.getElementById(data_items.id);
                    informasi.setAttribute('hidden', '');
                    informasi.style.display = 'none';

                    const formUpdate = document.createElement('form');
                    formUpdate.setAttribute('id', 'UpdateForm')

                    //membuat div yang terpisah antara lebel input dengan button;
                    for (let i = 0; i < label_title.length; i++) {
                        const div_label_input_Update = document.createElement('div');

                        //membuat label
                        const label = document.createElement('label');
                        label.textContent = label_title[i];
                        div_label_input_Update.append(label);

                        //membuat Input
                        const inputLabel = document.createElement('input');
                        if (i == 2) {
                            inputLabel.setAttribute('type', 'number');
                        }
                        inputLabel.setAttribute('data-testid', data_id[i] + "Edit");
                        inputLabel.value = dataTestId[i];
                        div_label_input_Update.append(inputLabel);

                        //Memasukan Kedalam Form
                        componentUpdate.append(div_label_input_Update)
                    }

                    //menciptakan div baru yang mana didalamnya terdapat grid 2 column agar label dan input 
                    //tepat berada di sebelah
                    const ComponentGrid = document.createElement('div');
                    ComponentGrid.setAttribute('class', 'componentDone');

                    ComponentGrid.append(componentUpdate);


                    const sectionButtonku = document.createElement('div');
                    const label_buttons = ["Update", "Batal"];
                    const image_label = ["aset/icons8-update-50.png", "aset/back-arrow-svgrepo-com.svg"]
                    let index = 0;
                    for (let label_button of label_buttons) {
                        let buttonUpdate = document.createElement('button');
                        buttonUpdate.setAttribute("category", label_button);

                        const images = document.createElement('img')
                        images.setAttribute('src', image_label[index]);
                        images.setAttribute('width', '30');
                        buttonUpdate.append(images)

                        buttonUpdate.setAttribute('id', 'ButtonSetting2')
                        sectionButtonku.append(buttonUpdate);

                        //Sesi Edit Data
                        if (label_button === "Update") {
                            buttonUpdate.addEventListener('click', function (e) {
                                e.preventDefault();
                                console.log("OKe");

                                const Judul = document.querySelector('[data-testid="bookFormTitleInputEdit"]').value;
                                const Author = document.querySelector('[data-testid="bookFormAuthorInputEdit"]').value;
                                const year = document.querySelector('[data-testid="bookFormYearInputEdit"]').value;
                                const id = data_items.id;


                                console.group(id);
                                updateByValue(id, Judul, Author, year);

                                document.getElementById('informasi' + data_items.id).removeAttribute('hidden');
                                document.getElementById('UpdateForm').setAttribute('hidden', true);
                                LoadData();
                            })
                        } else {
                            //Batal Edit Data
                            const SubmitAction = document.querySelector('[category="Batal"]')
                            console.log(buttonUpdate)
                            buttonUpdate.addEventListener('click', function (e) {
                                e.preventDefault();
                                document.getElementById("UpdateForm").setAttribute("Hidden", true);
                                document.getElementById(data_items.id).removeAttribute('hidden', true);
                                LoadData();
                            })
                        }
                        index++;
                    }
                    ComponentGrid.append(sectionButtonku)
                    formUpdate.append(ComponentGrid);
                    section.append(formUpdate);
                    event.preventDefault();

                    return section;

                });


            }
        }

    }



    didalam_section.append(sectionButton)
    section.append(didalam_section)
    document.dispatchEvent(new Event(read_Data));
    return section
}



window.addEventListener('DOMContentLoaded', function () {
    console.log("Storage Berhasil Dijalankan :)");
    LoadData();
    const ActiontoSubmit = document.getElementById('bookForm');
    ActiontoSubmit.addEventListener('submit', function (event) {
        const idku = makeID();
        const inputJudul = document.querySelector('[data-testid="bookFormTitleInput"]').value;
        const inputAuthor = document.querySelector('[data-testid="bookFormAuthorInput"]').value;
        const inputTahun = document.querySelector('[data-testid="bookFormYearInput"]').value;
        const checkbox = document.querySelector('[data-testid="bookFormIsCompleteCheckbox"]').checked;
        console.log(checkbox);
        RenderData(putdata(idku, inputJudul, inputAuthor, inputTahun, checkbox));
        document.dispatchEvent(new Event(read_Data));
    });


    document.getElementById("DisplayDone").addEventListener('click', function () {
        const check = document.getElementById("incompleteBookList").checked;
        console.log(check)

        if (check) {
            document.getElementById("incompleteBookList").setAttribute('hidden', 1);
            document.getElementById("incompleteBookList").checked = false;
            document.getElementById("DisplayDone").textContent = "View Data"
        } else {
            document.getElementById("incompleteBookList").removeAttribute('hidden');
            document.getElementById("incompleteBookList").checked = true;
            document.getElementById("DisplayDone").textContent = "Close Data"
        }


    })

    document.getElementById("DisplayDone2").addEventListener('click', function () {
        const check = document.getElementById("completeBookList").checked;
        console.log(check)

        if (check) {
            document.getElementById("completeBookList").setAttribute('hidden', 1);
            document.getElementById("completeBookList").checked = false;
            document.getElementById("DisplayDone2").textContent = "View Data"
        } else {
            document.getElementById("completeBookList").removeAttribute('hidden');
            document.getElementById("completeBookList").checked = true;
            document.getElementById("DisplayDone2").textContent = "Close Data"
        }


    })


    //SEARCH BOOK BY TITLE=====================================================================================

    document.getElementById("searchBookTitle").addEventListener('focus', function () {
        document.getElementById("SearchTitle").removeAttribute("hidden");

    })

    /*
    document.getElementById("searchBookTitle").addEventListener('blur', function (event) {
        document.getElementById("SearchTitle").setAttribute("hidden", true);
        document.getElementById("searchSubmit").setAttribute("hidden", true);

        const button = document.getElementById("searchSubmit");


        //tombol ini berfungsi apabila sudah mengisi suatu teks di dalam input search,dan akan menghapus seluruh karakter di text input
        button.addEventListener('click', function (event) {
            document.getElementById("searchBookTitle").value = ""
            document.getElementById("SearchTitle").innerHTML = "";
            button.setAttribute('hidden', true)
            event.preventDefault();
        })

        event.preventDefault();
    })
    */

    const LoadSearch = (data, search = 1) => {
        if (data != null) {
            for (let Items of data) {
                document.getElementById("SearchTitle").append(RenderData(Items, search));
            }
        } else {
            alert("Data Tidak Ada");
        }
    }

    const Search = document.getElementById("searchBook");
    Search.addEventListener('input', function () {
        const get_input = document.getElementById("searchBookTitle").value;
        const button = document.getElementById("searchSubmit");
        const button2 = document.getElementById("searchSubmit2");
        console.log(get_input);
        let search = null;

        let penentu_dihapus_result_search = document.getElementById('isTrue').checked;

        if (get_input) {
            let hasil = []
            search = searchName(get_input);
            hasil.push(search);
            button.textContent = "Telusuri";
            //Ketika data didalamnya hanya 0 karakter maka display search akan hilang
            if (hasil[0].length !== 0) {
                LoadSearch(search);
                console.log("Data Ada");
                button.removeAttribute("hidden");

            } else {
                console.log("Data Tidak Ada")
                document.getElementById("SearchTitle").innerHTML = "";
                button.setAttribute('hidden', '');
                button2.setAttribute('hidden', '');
            }
        } else {
            document.getElementById("SearchTitle").innerHTML = "";
            button.setAttribute('hidden', '');
            button2.setAttribute('hidden', '');
        };

        console.log(penentu_dihapus_result_search)
        //tombol ini berfungsi apabila sudah mengisi suatu teks di dalam input search,dan akan menghapus seluruh karakter di text input
        button.addEventListener('click', function (event) {
            event.preventDefault();
            document.getElementById("SearchTitle").innerHTML = "";
            search = searchName(get_input);
            LoadSearch(search, 2);
            button.setAttribute('hidden','');
            button2.removeAttribute('hidden');
            /*
            penentu_dihapus_result_search = false;
            document.getElementById("SearchTitle").innerHTML = "";
            document.getElementById("searchBookTitle").value = ""
            button.setAttribute('hidden','');   
            */

            console.log(penentu_dihapus_result_search);


            LoadData();
        })

    })
    LoadData();
    document.dispatchEvent(new Event(read_Data));

})