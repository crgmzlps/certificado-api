# certificado-api

API for generating course completion certificates

## tools

- [asdf-vm](https://asdf-vm.github.io/asdf/)
- [nodejs 14.16.0](https://nodejs.org/en/)
- [httpie](https://httpie.io/)

## starting the app

```sh
cd certificado-api
npm i
npm start
```

## how to use

Store the template for our certificates. the API will return the templateCode

```sh
http -f post localhost:3000/templates file@~/exemplo-certificado.hbs #POST multipart/form-data
```

Generate our conclusion certificate

```sh
http post localhost:3000/certificados name="John Doe" course="Node.js quick start" templateCode=7fa4730e-4013-42eb-a087-587afa0be43d date="01/01/2021" > certificate.pdf #classic POST request with JSON
```

With this two commands we can generate our certificates
