const express = require('express');
const fileUpload = require('express-fileupload');
const Jimp = require('jimp');

const app = express();
const port = 3000;

app.use(fileUpload());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/process-image', (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send('No se encontró ninguna imagen.');
  }

  const image = req.files.image;

  Jimp.read(image.data)
    .then((targetImage) => {
      targetImage.writeAsync('public/imagen_objetivo.png');

      const targetPixels = targetImage.bitmap.data;

      new Jimp(targetImage.getWidth(), targetImage.getHeight(), '#FFFFFF', (err, imagenFinal) => {
        if (err) throw err;

        imagenFinal.write('public/imagen_final.png', (err) => {
          if (err) throw err;

          console.log('Imagen final creada correctamente.');
          res.sendFile(__dirname + '/result.html');
        });
      });
    })
    .catch((err) => {
      console.error('Error al cargar la imagen objetivo:', err);
      res.status(500).send('Error al cargar la imagen objetivo.');
    });
});

app.listen(port, () => {
  console.log(`La aplicación está en funcionamiento en http://localhost:${port}`);
});

