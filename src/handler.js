const { nanoid } = require('nanoid');
const nodemon = require('nodemon');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    
    const { title, tags, body } = request.payload;
    
    const id = nanoid(16);

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
      };

      notes.push(newNote);
      const isSuccess = notes.filter((note)=> note.id === id).length > 0;

      if(isSuccess){

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
              noteId: id,
            },

          });
          
        response.code(201);
        response.header('Access-Control-Allow-Origin', '*');

        return response

      }

      const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
        
      });
      
      response.code(500);
      return response;

};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const note = notes.filter((n) => n.id === id)[0];
 
 if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();
  
 
  const index = notes.findIndex((note) => note.id === id); //mecari index berapa dalam array berdasarkan id. setelah ketemu index ke 0
  const createdAt = notes[index].createdAt

  console.log(`index : ${index}`) //menampilkan index ke 0
  console.log("notes[index]:")
  console.log(notes[index]) //menampilkan data pada index ke 0

  if (index !== -1) {
    
    notes[index] = {
      ...notes[index], //bisa pakai   const createdAt = notes[index].createdAt
      title,
      tags,
      body,
      createdAt,
      updatedAt,
    };

    console.log("...notes[index]:")
    console.log(notes[index])

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const index = notes.findIndex((note) => note.id === id);
 
  if (index !== -1) {
    notes.splice(index, 1); //menghapus arrray . index menunjukan index data yang akan dihapus dan 1 menunjukan 1 array saja yang di hapus
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }
 
 const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };
