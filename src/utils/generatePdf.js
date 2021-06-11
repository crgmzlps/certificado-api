const htmlpdf = require("html-pdf");

const defaultPdfOptions = {
  format: "A4",
  orientation: "landscape",
  border: "10mm",
};

exports.generatePdf = async function (html) {
  return new Promise((resolve, reject) => {
    htmlpdf.create(html, defaultPdfOptions).toStream((err, stream) => {
      if (!err) {
        resolve(stream);
      } else {
        reject(err);
      }
    });
  });
};
