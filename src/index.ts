import express from "express";
// import { categoryRoutes } from "./infrastructure/http/routes/category.routes";
// import { flashcardRoutes } from "./infrastructure/http/routes/flashcard.routes";

const app = express();
app.use(express.json());

app.use("/categories", categoryRoutes);
app.use("/flashcards", flashcardRoutes);

app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});
