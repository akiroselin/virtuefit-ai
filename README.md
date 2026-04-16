# VirtueFit AI - AI-Powered Virtual Try-On Platform

A cutting-edge virtual clothing design and try-on platform powered by AI, featuring real-time 3D/4D visualization with WebGPU and Three.js, and AI-generated outfits via ComfyUI.

![VirtueFit AI](https://via.placeholder.com/800x400/0a0a0f/667eea?text=VirtueFit+AI)

## 🚀 Features

- **AI-Powered Design**: Generate unique outfits using natural language prompts
- **Real-time 3D/4D Visualization**: Interactive virtual try-on with WebGPU acceleration
- **Style Presets**: Quick-start with predefined style categories
- **Color Preferences**: Select up to 3 preferred colors for your designs
- **Generation History**: Track and revisit all your creations
- **Favorites**: Save your favorite designs for quick access
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI**: Cyberpunk-inspired aesthetic with glass morphism effects

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Three.js + React Three Fiber** - 3D rendering engine
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **ComfyUI** - AI image generation (external service)

### Deployment
- **Vercel** - Zero-config deployment

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/virtuefit-ai.git
   cd virtuefit-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your ComfyUI credentials:
   ```
   COMFYUI_API_URL=https://your-comfyui-server.com
   COMFYUI_API_KEY=your_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/virtuefit-ai.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   In Vercel dashboard, add:
   - `COMFYUI_API_URL`
   - `COMFYUI_API_KEY`
   - `NEXT_PUBLIC_APP_URL`

4. **Deploy**
   Vercel will automatically build and deploy your application.

## 🎨 ComfyUI Integration

### Setting Up ComfyUI

1. **Install ComfyUI**
   ```bash
   git clone https://github.com/comfyanonymous/ComfyUI.git
   cd ComfyUI
   pip install -r requirements.txt
   ```

2. **Run ComfyUI**
   ```bash
   python main.py
   ```

3. **Create Workflow**
   Design your virtual try-on workflow in the ComfyUI interface and export the API format.

### API Integration

The application communicates with ComfyUI via REST API:

```
POST /api/generate
GET  /api/generate/[jobId]
```

## 📁 Project Structure

```
virtuefit-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       ├── route.ts        # POST - Create generation job
│   │   │       └── [jobId]/route.ts # GET  - Check job status
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ModelViewer.tsx          # 3D viewer with WebGPU
│   │   ├── PromptInput.tsx          # AI prompt interface
│   │   ├── StylePresets.tsx        # Style selection grid
│   │   ├── GenerationResults.tsx   # Results gallery
│   │   └── LoadingOverlay.tsx      # Generation animation
│   └── store/
│       └── useStore.ts             # Zustand state management
├── public/
├── .env.local.example
├── next.config.js
├── tailwind.config.js
├── vercel.json
└── package.json
```

## 🎯 Usage Guide

### Creating an Outfit

1. **Enter a prompt** - Describe your desired outfit in the text area
2. **Select colors** - Choose up to 3 preferred colors
3. **Choose a style** (optional) - Pick from the style presets
4. **Generate** - Click the generate button or press `⌘ + Enter`
5. **View results** - Check the generation history for your created outfits

### 3D Viewer Controls

- **Drag** - Rotate the model
- **Scroll** - Zoom in/out
- **Auto-rotate** - Toggle automatic rotation

### Managing Results

- **Heart icon** - Add/remove from favorites
- **Download** - Save the generated image
- **Share** - Generate a shareable link
- **Regenerate** - Create a new variation

## 🔧 Configuration

### Theme Customization

Edit `tailwind.config.js` to customize colors and styling:

```javascript
colors: {
  'space-black': '#0a0a0f',
  'dark-purple': '#14141f',
  // ... add your custom colors
}
```

### Style Presets

Edit `src/components/StylePresets.tsx` to add or modify style presets.

### ComfyUI Workflow

Edit `src/app/api/generate/route.ts` to customize the ComfyUI prompt structure for your workflow.

## 📝 API Reference

### POST /api/generate

Create a new outfit generation job.

**Request Body:**
```json
{
  "prompt": "A futuristic silver jacket with LED accents",
  "style": "cyberpunk",
  "colors": ["#000000", "#667eea", "#764ba2"]
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued"
}
```

### GET /api/generate/[jobId]

Check the status of a generation job.

**Response:**
```json
{
  "status": "completed",
  "images": [
    "https://comfyui-server.com/view?filename=output_001.png",
    "https://comfyui-server.com/view?filename=output_002.png"
  ]
}
```

## 🌐 Browser Support

- **Chrome/Edge 113+** - Full WebGPU support
- **Firefox 121+** - WebGPU support (behind flag)
- **Safari 17+** - WebGPU support
- **Fallback** - WebGL 2.0 for older browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D rendering
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI) - AI image generation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Vercel](https://vercel.com/) - Hosting and deployment

---

Built with ❤️ by VirtueFit AI Team
