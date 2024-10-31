const fs = require("fs");
const cherrio = require("cheerio");
const axios = require("axios");

let products = [];
let res = async () => {
  //
  const name_razdel = "aksessuary";
  const name_category = "svetilniky";
  let url = axios.get(
    `https://ecommers.ru/catalog/${name_category}/${name_razdel}/` // пример ссылки
  );
  url.then((response) => {
    // массив данных
    let $ = cherrio.load(response.data);
    // перебор массива
    $(".catalog__list")
      .find(".catalog-card")
      .each((index, element) => {
        // артикл
        const product_article =
          $(element)
            .find(".catalog-card__colors")
            .text()
            .replace(/\s+/g, " ")
            .trim()
            .split(/[:#] /)[1] ||
          $(element)
            .find(".catalog-card__article")
            .text()
            .replace(/\s+/g, " ")
            .trim()
            .split(/[:#] /)[0] ||
          "article null";
        // название
        const product_title = $(element)
          .find(".catalog-card__title")
          .text()
          .replace(/\s+/g, " ")
          .trim();
        // цена
        const product_price =
          $(element)
            .find(".catalog-card__desc")
            .find(".catalog-card__price")
            .text()
            .replace(/\s+/g, " ")
            .trim() ||
          $(element)
            .find(".catalog-card__desc")
            .find("p")
            .text()
            .replace(/\s+/g, " ")
            .trim();
        // картинка
        const product_image = $(element)
          .find(".catalog-card__img-img  img")
          .attr("src");
        // шаблон для записи в файл

        const productItem = {
          // номер страницы
          product: index + 1, // номер страницы
          product_article: product_article,
          product_title: product_title,
          product_price: product_price,
          product_image: `https://ecommers.ru${product_image}`,
        };
        products.push(productItem);
      });
    // сохраняем в файл
    fs.writeFile(
      `${name_razdel}.json`,
      JSON.stringify(products),
      (err) => async () => {
        if (err) {
          console.log(err);
        } else {
          console.log("The file has been saved!");
        }
      }
    );
    //
  });
};
const main = async () => {
  res();
};

main();
