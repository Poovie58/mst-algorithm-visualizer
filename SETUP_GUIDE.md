# MST Algorithm Visualizer - Setup Guide

ตัวช่วยเปรียบเทียบ Prim's vs Kruskal's Algorithm พร้อม responsive design

## 📋 Prerequisites (สิ่งที่ต้องมีก่อน)

ตรวจสอบว่าคุณมีติดตั้งแล้ว:

```bash
# ตรวจสอบ Node.js version (ต้อง v14+)
node --version

# ตรวจสอบ npm version
npm --version
```

ถ้ายังไม่มี:
- **Node.js**: ดาวน์โหลดจาก https://nodejs.org/ (LTS version แนะนำ)
- ติดตั้ง Node.js ก็จะมี npm มาด้วยอัตโนมัติ

---

## 🚀 Quick Start (วิธีรัน)

### Step 1: Clone Repository
```bash
# Clone project จาก GitHub
git clone https://github.com/Poovie58/mst-algorithm-visualizer.git

# เข้าไปในโฟลเดอร์
cd mst-algorithm-visualizer
```

### Step 2: Install Dependencies
```bash
# ติดตั้ง packages ทั้งหมด
npm install
```

⏳ **รอสักครู่** ให้ npm ดาวน์โหลด dependencies เสร็จ (อาจใช้เวลา 1-3 นาที)

### Step 3: Start Development Server
```bash
# รัน development server
npm start
```

✅ **ผลลัพธ์**: เบราว์เซอร์จะเปิดอัตโนมัติที่ `http://localhost:3000`

---

## 📂 Project Structure

```
mst-algorithm-visualizer/
├── src/
│   ├── components/
│   │   ├── GraphGenerator.jsx          # หน้า Generate Graph (RESPONSIVE)
│   │   ├── GraphVisualizer.jsx         # แสดงผลกราฟด้วย Cytoscape.js
│   │   ├── AlgorithmComparison.jsx     # รัน Prim's vs Kruskal's
│   │   ├── ComparisonResults.jsx       # ตารางเปรียบเทียบผล
│   │   ├── StepByStepAnimation.jsx     # Animation ทีละ step
│   │   └── ResultsChart.jsx            # Chart สรุปผล
│   │
│   ├── utils/
│   │   ├── graphUtils.js               # Graph generation & validation
│   │   ├── primsAlgorithm.js           # Prim's Algorithm implementation
│   │   ├── kruskalsAlgorithm.js        # Kruskal's Algorithm implementation
│   │   └── algorithmComparison.js      # Comparison metrics
│   │
│   ├── App.jsx                         # Main app component
│   ├── App.css                         # Global styles (Tailwind)
│   └── index.js                        # Entry point
│
├── public/
│   ├── index.html                      # HTML template
│   └── favicon.ico
│
├── package.json                        # Dependencies & scripts
├── tailwind.config.js                  # Tailwind CSS config
└── README.md                           # This file
```

---

## 🎨 Responsive Design (ปรับแต่งจอ)

Component ทั้งหมดรองรับ 3 ขนาดจอ:

| Breakpoint | ขนาดจอ | Tailwind | ตัวอย่าง |
|-----------|--------|---------|---------|
| Mobile | < 768px | `-` (default) | iPhone, Android |
| Tablet | 768-1024px | `md:`, `lg:` | iPad, Tab S |
| Desktop | > 1024px | `lg:` | Laptop, PC |

### ทดสอบ Responsive บน VSCode:

**วิธี 1: ใช้ Built-in DevTools**
```
ในเบราว์เซอร์ → F12 หรือ Ctrl+Shift+I
→ Ctrl+Shift+M (Toggle device toolbar)
→ เลือก "iPhone SE" (375px) / "iPad" (768px) / "Laptop" (1024px+)
```

**วิธี 2: ลากขยายหน้าต่างเบราว์เซอร์**
```
ลากมุมขวาของเบราว์เซอร์ให้เล็ก → ดูว่า layout เปลี่ยนเป็น mobile
```

---

## 📦 Install Tailwind CSS (ถ้ายังไม่มี)

Project นี้ใช้ **Tailwind CSS** สำหรับ responsive design

```bash
# ถ้าสร้าง project ใหม่ด้วย Create React App
npx create-react-app mst-algorithm-visualizer
cd mst-algorithm-visualizer

# ติดตั้ง Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

จากนั้นแก้ไข `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

และใน `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 🛠️ Available Scripts

```bash
# รัน development server (พร้อม hot reload)
npm start

# Build สำหรับ production
npm run build

# รัน tests
npm test

# Eject configuration (⚠️ ไม่สามารถย้อนกลับได้)
npm run eject
```

---

## 📱 Testing on Different Devices

### Desktop (1920x1080)
```bash
npm start
# เบราว์เซอร์จะเปิดเต็มจอ
```

### Tablet (iPad - 768x1024)
```
F12 → Toggle device toolbar → iPad
```

### Mobile (iPhone SE - 375x667)
```
F12 → Toggle device toolbar → iPhone SE
```

### ทดสอบ Touch Interaction
```
F12 → Device toolbar → Enable "Touch simulation" ✓
→ ลองเลื่อน slider ด้วย "นิ้ว" (drag แบบ touch)
```

---

## 🐛 Troubleshooting

### ❌ Error: `npm: command not found`
**วิธีแก้**: Node.js ยังไม่ติดตั้ง → ดาวน์โหลด https://nodejs.org

### ❌ Error: `Cannot find module 'react'`
```bash
npm install
```

### ❌ Port 3000 already in use
```bash
# วิธี 1: ใช้ port อื่น
PORT=3001 npm start

# วิธี 2: Kill process ที่ใช้ port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### ❌ Tailwind styles ไม่ปรากฏ
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules
npm install

# หรือ purge cache
npm run build
```

### ❌ Hot reload ไม่ทำงาน
```bash
# ปิด terminal และรัน npm start ใหม่
npm start
```

---

## 💻 VSCode Extensions (แนะนำ)

ติดตั้ง extensions เหล่านี้ใน VSCode เพื่อความสะดวก:

1. **ES7+ React/Redux/React-Native snippets**
   - ID: `dsznajder.es7-react-js-snippets`
   - ใช้สำหรับ code snippets

2. **Tailwind CSS IntelliSense**
   - ID: `bradlc.vscode-tailwindcss`
   - Auto-complete Tailwind class names

3. **Prettier - Code formatter**
   - ID: `esbenp.prettier-vscode`
   - Auto-format code

4. **Thunder Client** (หรือ Postman)
   - ทดสอบ API calls

### ติดตั้งใน VSCode:
```
Ctrl+Shift+X (Extensions marketplace)
→ Search "Tailwind CSS IntelliSense"
→ Click Install
```

---

## 📝 Usage Example

### ใช้ GraphGenerator Component:

```jsx
import GraphGenerator from './components/GraphGenerator';

function App() {
  const handleGraphGenerated = (graph) => {
    console.log('Generated graph:', graph);
    // {
    //   nodes: [{id: 0, label: 'Node 0'}, ...],
    //   edges: [{source: 0, target: 1, weight: 45, id: 'edge-0-1'}, ...]
    // }
  };

  return (
    <GraphGenerator onGraphGenerated={handleGraphGenerated} />
  );
}

export default App;
```

---

## 🔧 Configuration Files

### `package.json` - Dependencies
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

### `tailwind.config.js` - Responsive Breakpoints
```javascript
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large Desktop
    }
  }
}
```

---

## 🚀 Deploy (นำขึ้น Server)

### Deploy ไป Vercel (แนะนำ สำหรับ React)

```bash
# ติดตั้ง Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy ไป GitHub Pages
```bash
npm run build
# ย้ายไฟล์ใน build/ ขึ้นไป GitHub Pages

# หรือใช้ gh-pages package
npm install --save-dev gh-pages
```

---

## 📚 Resources & Documentation

- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Cytoscape.js**: https://cytoscape.org
- **Node.js Docs**: https://nodejs.org/docs

---

## 👥 Team

- **ทีม 3 คน ปี 1**
- โปรเจค: Prim's vs Kruskal's Algorithm Comparison

---

## 📄 License

MIT License - ดูเพิ่มเติมใน `LICENSE` file

---

## ❓ FAQ

**Q: ต้องติดตั้ง Git ด้วยไหม?**
> A: ถ้าต้องการ clone จาก GitHub ใช่ ดาวน์โหลด https://git-scm.com

**Q: สามารถใช้ `yarn` แทน `npm` ได้ไหม?**
> A: ได้ `yarn install` แล้ว `yarn start` (ข้อแนะนำ: ใช้ npm ให้สม่ำเสมอ)

**Q: จะเพิ่ม package ใหม่ยังไง?**
> A: `npm install <package-name>` (ตัวอย่าง: `npm install axios`)

**Q: Code ที่แก้ไขแล้ว reload ไม่ปรากฏเนื่องจากอะไร?**
> A: ตรวจสอบ browser console (F12) มี error ไหม? ถ้ามี ให้แก้ไข file แล้ว save

---

✨ **สำเร็จแล้ว! ยินดีต้อนรับเข้า MST Algorithm Visualizer** 🎉
