import File from '../models/File'

class FileController{
  async store(req, res){

    //Aqui é pego os campos importantes do retorno json e adaptado para como esta no bd
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path
    });

    return res.json({file})
  
  }
}

export default new FileController();