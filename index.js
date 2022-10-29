const http = require("http");
const path = require("path");
const fs = require("fs/promises");
const { Console } = require("console");
const { parse } = require("path");

const PORT = 3001;

const app = http.createServer(async (request, response) => {
  //dentro del objeto request podemos leer el metodo de la peticion
  //GET---POST---PUT---DELETE
  const requestMethod = request.method;
  //lee la ruta de la peticion
  const requestUrl = request.url;
  console.log(requestUrl, requestMethod);
  //responder cuandp se realice un GET al endpoint  --/apiv1/users--
  if (requestUrl.startsWith("/apiv1/tasks")) {
    //respondo con el data json
    //dependiendo de q metodo sea 
    if (requestMethod === "GET") {
      //obetener la ruta del json

      const jsonPath = path.resolve('./data.json');
      const jsonFile = await fs.readFile(jsonPath, "utf8");
      response.writeHead("200", "Content-Type", "application/json");

      response.write(jsonFile);

    }

    if (requestMethod === "POST") {
      const jsonPath = path.resolve('./data.json');

      let parsedExt = "";

      request.on("data", (data) => {
        const parsed = JSON.parse(data);
        console.log(parsed);
        parsedExt = parsed;
      })

      const data = await fs.readFile(jsonPath, "utf8");

      const parsedData = JSON.parse(data);

      console.log(parsedData);

      parsedData.push(parsedExt);

      console.log(parsedData);

      parsedData[parsedData.length - 1].id = parsedData.length;

      await fs.writeFile(jsonPath, `${JSON.stringify(parsedData)}`).then((data) => {
        response.writeHead("201");
      });

    }

    if (requestMethod === "PUT") {

      const jsonPath = path.resolve('./data.json');
      const data = await fs.readFile(jsonPath, "utf8");
      const dataParsed = JSON.parse(data);

      const id = parseInt(requestUrl.split("/").at(-1));
      console.log(id);

      request.on("data", (data) => {
        const parsedNew = JSON.parse(data);
        // console.log(parsedNew);

        dataParsed.forEach(task => {

          if (id === task.id) {
            console.log(id);
            task.title = parsedNew.title;
            task.description = parsedNew.description;
            task.status = parsedNew.status;
          }
        });
      })


      await fs.writeFile(jsonPath, `${JSON.stringify(dataParsed)}`);

      console.log(jsonPath);
      console.log(dataParsed);
    }


    if (requestMethod === "DELETE") {
      const jsonPath = path.resolve('./data.json');
      const data = await fs.readFile(jsonPath, "utf8");
      const dataParsed = JSON.parse(data);

      const id = parseInt(requestUrl.split("/").at(-1));
      console.log(id);

      console.log(dataParsed);

      const result = dataParsed.filter(task => task.id !== id);

      console.log(result);

      await fs.writeFile(jsonPath, `${JSON.stringify(result)}`);



    }






  } else {
    response.writeHead("505");//poner un estado de la respuesta 
  }


  response.end();
});





app.listen(PORT);



