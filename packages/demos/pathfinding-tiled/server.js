// esbuild ./src/index.ts --bundle --sourcemap --watch --loader:.png=dataurl --outfile=dist/demo.js --servedir=dist
import esbuild from "esbuild";
import express from "express";
import path from "path";

const PORT = 3000;
const app = express();

// Start esbuild in watch mode
const ctx = await esbuild.context({
  entryPoints: ["src/index.ts"],
  bundle: true,
  sourcemap: true,
  outfile: "dist/demo.js",
  loader: {
    ".png": "dataurl",
  },
});

await ctx.watch();

// Serve static files from dist
app.use(express.static("dist"));

// Serve assets from src/assets
app.use("/assets", express.static("src/assets"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
