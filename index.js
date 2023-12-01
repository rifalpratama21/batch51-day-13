const express = require("express");
const path = require("path");
const app = express();
const PORT = 5000;
const dateDuration = require("./src/helper/duration");

const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

// setup call hbs with sub folder
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

// set serving static file
app.use(express.static(path.join(__dirname, "src/assets")));

// parsing data from client
app.use(express.urlencoded({ extended: false }));

// routing
app.get("/", home);

app.get("/blog", blog);
app.post("/blog", addBlog);

app.get("/contact", contact);
app.get("/blog-detail/:id", blogDetail);
app.get("/form-blog", formBlog);
app.get("/delete-blog/:id", deleteBlog);
app.get("/edit-blog/:id", viewEditBlog);
app.post("/edit-blog", updateBlog);
// app.post('/form-blog', addBlog)

let dataBlog = [];

// local server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// index
async function home(req, res) {
  const query = `SELECT * FROM projects`;
  let obj = await sequelize.query(query, { type: QueryTypes.SELECT });
  let dataBlogRes = obj.map((item) => {
    return {
      ...item,
      duration: dateDuration(item.startDate, item.endDate),
      techs: viewIcon(item.technologies),
    };
  });
  res.render("index", { dataBlog: dataBlogRes });
}

// blog
function blog(req, res) {
  res.render("blog");
}

// form blog
function formBlog(req, res) {
  res.render("form-blog");
}

// contact me
function contact(req, res) {
  res.render("contact");
}

//delete blog
function deleteBlog(req, res) {
  const { id } = req.params;

  dataBlog.splice(id, 1);
  res.redirect("/");
}

// blog detail
function blogDetail(req, res) {
  const { id } = req.params;

  res.render("blog-detail", { blog: dataBlog[id] });
}

// add a new blog
function addBlog(req, res) {
  const {
    title,
    author,
    content,
    startDate,
    endDate,
    nodejs,
    js,
    react,
    vuejs,
  } = req.body;

  const data = {
    id: new Date().getTime(),
    title: title,
    author: author,
    content: content,
    startDate: startDate,
    endDate: endDate,
    nodeJs: nodejs,
    js: js,
    react: react,
    vuejs: vuejs,
    image: "image.png",
    postedAt: new Date(),
  };

  dataBlog.push(data);
  res.redirect("/");
}

// view edit Blog with index/id
function viewEditBlog(req, res) {
  const { id } = req.params;
  //   const dataIndex = parseInt(id);

  //   if (dataBlog.length > dataIndex && dataIndex >= 0) {
  //     const dataEdit = dataBlog[dataIndex];
  //     dataEdit.id = dataIndex;

  //     res.render("edit-blog", {
  //       edit: dataEdit,
  //       dataBlog,
  //     });
  //   } else {
  //     res.send('<h2 class="fw-bold m-3 text-center">Data Not Found</h2>');
  //   }
  //   console.log("datates:", dataBlog);
  // }

  res.render("edit-blog", { edit: dataBlog[id] });
  console.log("data masuk :", dataBlog);
}

// edit blog
function updateBlog(req, res) {
  const { id } = req.params;
  const {
    title,
    content,
    author,
    startDate,
    endDate,
    nodejs,
    js,
    react,
    vuejs,
  } = req.body;
  let updateDataBlog = {
    title: title,
    content: content,
    author: author,
    startDate: startDate,
    endDate: endDate,
    nodeJs: nodejs,
    js: js,
    react: react,
    vuejs: vuejs,
    image: "image.png",
    postedAt: new Date(),
  };
  // updateDataBlog = dataBlog.filter((item) => {
  //   return item.id != id;
  // });
  // updateDataBlog.unshift(dataBlog);
  //  ataBlog[id] = dataBlog; d
  dataBlog[parseInt(id)] = updateDataBlog;
  res.redirect("/");
  console.log("sudah terupdate :", dataBlog);
}

function viewIcon(icon) {
  let codeIcon = "";

  for (i = 0; i < icon.length; i++) {
    if (icon[i] == "nodejs") {
      codeIcon += `<i class="fa-brands fa-node-js"></i>`;
    } else if (icon[i] == "js") {
      codeIcon += `<i class="fa-brands fa-js"></i>`;
    } else if (icon[i] == "react") {
      codeIcon += `<i class="fa-brands fa-react"></i>`;
    } else if (icon[i] == "vuejs") {
      codeIcon += `<i class="fa-brands fa-vuejs"></i>`;
    }
  }

  return codeIcon;
}

function viewIconHbs(icon) {
  let codeIcon = "";

  for (i = 0; i < icon.length; i++) {
    if (icon[i] == "nodejs") {
      codeIcon += `<i class="fa-brands fa-node-js" style="font-size: 80px; margin-right: 8px;"></i>`;
    } else if (icon[i] == "js") {
      codeIcon += `<i class="fa-brands fa-js" style="font-size: 80px; margin-right: 8px;"></i>`;
    } else if (icon[i] == "react") {
      codeIcon += `<i class="fa-brands fa-react" style="font-size: 80px; margin-right: 8px;"></i>`;
    } else if (icon[i] == "vuejs") {
      codeIcon += `<i class="fa-brands fa-vuejs" style="font-size: 80px; margin-right: 8px;"></i>`;
    }
  }

  return codeIcon;
}

function techArray(techs) {
  let technologies = [];

  if (techs.nodejs == "nodejs") {
    technologies.push(`'nodejs'`);
  }
  if (techs.js == "js") {
    technologies.push(`'js'`);
  }
  if (techs.react == "react") {
    technologies.push(`'react'`);
  }
  if (techs.vuejs == "vuejs") {
    technologies.push(`'vuejs'`);
  }

  return technologies;
}
