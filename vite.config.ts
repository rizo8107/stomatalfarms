import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

function generateReviewsList() {
  const reviewsDir = path.resolve(__dirname, "public/reviews");
  if (!fs.existsSync(reviewsDir)) return;
  const files = fs.readdirSync(reviewsDir);
  const images = files.filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f));

  // Sort by date (by day) descending, then naturally by filename ascending
  const getFileDateString = (file: string) => {
    // 1. Try to parse date from filename first (deterministic in CI/deployed environments where mtimes may equal checkout time)
    const revwMatch = file.match(/revw\s+(\d{2})-(\d{2})/i);
    if (revwMatch) {
      const day = revwMatch[1];
      const month = revwMatch[2];
      return `2026-${month}-${day}`;
    }

    if (file.startsWith("review-")) {
      return "2026-05-05"; // Original reviews date
    }

    // 2. Fallback to file modification date
    const filePath = path.join(reviewsDir, file);
    try {
      const stats = fs.statSync(filePath);
      const date = stats.mtime;
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    } catch (e) {
      return "1970-01-01";
    }
  };

  const naturalSort = (a: string, b: string) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  };

  images.sort((a, b) => {
    const dateA = getFileDateString(a);
    const dateB = getFileDateString(b);

    if (dateA !== dateB) {
      return dateB.localeCompare(dateA); // Newest date first
    }

    return naturalSort(a, b); // Same day, sort naturally by filename
  });

  const reviews = images.map((file) => {
    let alt = "Google Review";
    if (file.startsWith("review-")) {
      const knownAlts: Record<string, string> = {
        "review-1.png": "Google review by Nirmal PY",
        "review-2.png": "Google review by Partho Ghosh",
        "review-3.png": "Google review by Pinkesh Kumar",
        "review-4.png": "Google review by indumathi venugopal",
        "review-5.png": "Google review by Sathya Seelan r",
        "review-6.png": "Google review by Vennila Vidhya",
        "review-7.png": "Google review by nithya rajsri",
        "review-8.png": "Google review by nandhini karthikeyan",
        "review-9.png": "Google review by Guru Venkatesan",
        "review-10.png": "Google review by Rakesh Pandian",
      };
      alt = knownAlts[file] || `Google Review ${file.replace("review-", "").replace(/\.[^/.]+$/, "")}`;
    } else if (file.startsWith("revw")) {
      alt = `Customer Review ${file.replace("revw ", "").replace(/\.[^/.]+$/, "")}`;
    }
    return {
      src: `/reviews/${file}`,
      alt,
    };
  });

  const content = `// This file is auto-generated. Do not edit directly.
export const reviews = ${JSON.stringify(reviews, null, 2)};
`;

  const outputPath = path.resolve(__dirname, "src/components/reviews-list.ts");
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, content);
}

const reviewsGeneratorPlugin = () => ({
  name: "vite-plugin-reviews-generator",
  buildStart() {
    generateReviewsList();
  },
  configureServer(server: any) {
    const reviewsDir = path.resolve(__dirname, "public/reviews");
    server.watcher.add(reviewsDir);
    server.watcher.on("all", (event: string, filePath: string) => {
      if (filePath.includes("public/reviews")) {
        generateReviewsList();
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "localhost",
    port: 5173,
    allowedHosts: [
      "0448-106-51-152-69.ngrok-free.app",
      ".ngrok-free.app"
    ],
    hmr: {
      host: "localhost",
      port: 5173,
    },
  },
  plugins: [react(), reviewsGeneratorPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react-router-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-accordion",
            "@radix-ui/react-tabs",
            "@radix-ui/react-select",
          ],
          "vendor-shopify": ["shopify-buy", "@shopify/hydrogen-react"],
        },
      },
    },
    chunkSizeWarningLimit: 300,
  },
}));
