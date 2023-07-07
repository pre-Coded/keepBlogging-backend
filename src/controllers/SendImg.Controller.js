const fs = require('fs');

const SendImg = (req, res) => {



    const { filename } = req.params;
    const imagePath = `/Users/princerastogi/Desktop/fullStack/todo/todo/backend/uploads/${filename}`;

    try {
        const data = fs.readFileSync(imagePath);
        const base64Image = data.toString('base64');
        res.contentType('image/jpeg'); // Set the content type to match your image file type
        res.send(base64Image);
    } catch (err) {
        console.error(err);
        res.sendStatus(404); // Image not found
    }
}

module.exports = SendImg;