const read_Data = 'READ_BOOK';
const StorageBookKey = 'STORAGE_BOOK';



const CheckStorage = () => {
    if (typeof (Storage) === 'undefined') {
        return false;
    } else {
        return true;
    }
}


const deleteById = (id) => {
    const data = JSON.parse(localStorage.getItem(StorageBookKey));
    const index = data.findIndex((item) => item.id == id)
    data.splice(index, 1);
    localStorage.setItem(StorageBookKey, JSON.stringify(data));
    alert("Data Berhasil Dihapus");

}

const Sudah_Selesai = (id, selesai = true) => {
    const data = JSON.parse(localStorage.getItem(StorageBookKey));
    const index = data.findIndex((item) => item.id == id)
    const data_update = data[index];
    data_update.isComplete = selesai;
    localStorage.setItem(StorageBookKey, JSON.stringify(data));

}

const makeID = () => {
    return +new Date();
}

const putdata = (idku, inputJudul, inputAuthor, inputTahun, isComplete) => {
    console.log("oke");
    if (CheckStorage) {
        let Books = []
        if (localStorage.getItem(StorageBookKey) !== null) {
            Books = JSON.parse(localStorage.getItem(StorageBookKey))
        }

        const data_baru = {
            id: idku,
            title: inputJudul,
            author: inputAuthor,
            year: Number(inputTahun),
            isComplete: isComplete
        }

        Books.push(data_baru);
        const parsed_to_array = JSON.stringify(Books);
        localStorage.setItem(StorageBookKey, parsed_to_array);
        return Books
    }
}



const updateByValue = (id, v1, v2, v3) => {

    const data = JSON.parse(localStorage.getItem(StorageBookKey));
    const index = data.findIndex((items) => items.id == id);

    data[index].title = v1;
    data[index].author = v2;
    data[index].year = v3;

    console.log("Data Berhasil Dirubah");
    localStorage.setItem(StorageBookKey, JSON.stringify(data));
    alert("Data Berhasil Dirubah");
}


const searchName = (name) => {
    const data = JSON.parse(localStorage.getItem(StorageBookKey));
    let result = [];
    for (let items_data of data) {
        if (items_data.title.toLowerCase() === name.toLowerCase().trim()) {
            result.push(items_data)
        }
    }

    return result;

}

export {read_Data, StorageBookKey ,deleteById, Sudah_Selesai, makeID, putdata, updateByValue, searchName, CheckStorage};