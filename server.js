const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

// Conectar antes de escuchar

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos (CSS, imágenes, etc.)

app.use(express.urlencoded({ extended: true }));

app.use("/style", express.static("style"));
app.use("/img", express.static("img"));
app.use("/font", express.static("font"));
app.use(express.json());

// Ruta principal → HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

//Transporte de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/resena", async (req, res) => {
  const { nombre, pregunta1, pregunta2, rating, resena } = req.body;

  try {
    await transporter.sendMail({
      from: `"Reseñas Popeyes 🍗" <feedbackpopeyes@gmail.com>`,
      to: process.env.EMAIL_TO,
      subject: "Nueva reseña recibida",
      html: `
        <h2>Nueva reseña</h2>
        <p><strong>Nombre: </strong> ${nombre}</p>
        <p><strong>P1-¿Es tu primera vez comiendo popeyes?🍗: </strong> ${pregunta1}</p>
        <p><strong>P2-¿Qué es lo que mas te gustó?😋: </strong> ${pregunta2}</p>
        <p><strong>Calificación: </strong> ${rating} ⭐</p>
        <p><strong>---::RESEÑA::--</strong></p>
        <p>${resena}</p>
      `,
    });

    //res.send("✅ Reseña enviada correctamente");
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("❌ Error al enviar correo");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
