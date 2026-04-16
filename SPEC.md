# AI Virtual Try-On Platform - SPEC.md

## 1. Concept & Vision

**名称**：VirtueFit AI
**概念**：一个由 AI 主导的个性化虚拟服装定制平台，用户可以通过自然语言描述或选择预设风格，在虚拟模特身上实时预览 4D 虚拟穿搭效果。

**核心理念**：
- AI 驱动的设计过程 - 用户描述需求，AI 生成并推荐穿搭
- 实时 3D/4D 可视化 - 使用 WebGPU + Three.js 实现流畅的虚拟试穿体验
- 个性化定制 - 基于用户偏好和体型数据生成专属穿搭

## 2. Design Language

### Aesthetic Direction
赛博朋克 × 高端时装店的融合风格。深邃的暗色调背景搭配霓虹渐变强调色，营造未来感；同时保持简洁的布局和高品质的视觉呈现，传递奢侈品的精致感。

### Color Palette
```
Primary Background: #0a0a0f (深空黑)
Secondary Background: #14141f (暗紫灰)
Accent Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)
Text Primary: #ffffff
Text Secondary: #a0a0b0
Border/Divider: rgba(255, 255, 255, 0.08)
Glass Effect: rgba(255, 255, 255, 0.05) with backdrop-blur
```

### Typography
- **Headings**: "Space Grotesk", sans-serif (Google Fonts)
- **Body**: "Inter", sans-serif
- **Monospace/Labels**: "JetBrains Mono", monospace

### Motion Philosophy
- 页面过渡：300ms ease-out 淡入淡出
- 悬停效果：150ms 微妙发光和缩放
- 3D 模型加载：骨架动画 + 淡入
- AI 生成中：脉冲发光效果 + 进度环
- 交互反馈：涟漪效果 + 粒子散射

## 3. Layout & Structure

### 页面结构

```
┌─────────────────────────────────────────────────────────────┐
│  Header: Logo + Nav (Home, Create, Gallery, Profile) + AI助手 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐  ┌─────────────────────────────┐│
│  │                      │  │                             ││
│  │   3D Model Viewer    │  │    AI Prompt Input Area      ││
│  │   (WebGPU/Three.js)  │  │    + Style Presets           ││
│  │                      │  │    + Generation Controls     ││
│  │                      │  │                             ││
│  └──────────────────────┘  └─────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Generated Results Carousel / Full Preview Modal         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Footer: © 2025 VirtueFit AI | 技术支持 | 隐私政策           │
└─────────────────────────────────────────────────────────────┘
```

### 响应式策略
- **Desktop (>1200px)**: 双栏布局，3D 视图与控制面板并排
- **Tablet (768-1200px)**: 堆叠布局，3D 视图在上，控制面板在下
- **Mobile (<768px)**: 全屏 3D 视图 + 底部抽屉式控制面板

## 4. Features & Interactions

### 核心功能

#### 4.1 AI 服装生成 (ComfyUI 后端)
- **自然语言输入**: 用户描述想要的穿搭风格
- **预设风格选择**: 预设标签快速选择 (Streetwear, Formal, Avant-garde, Minimalist, Cyberpunk)
- **颜色/材质偏好**: 通过色板或文字指定
- **体型参数**: 输入身高、三围数据用于虚拟试穿适配

#### 4.2 3D/4D 虚拟试穿 (Three.js + WebGPU)
- **实时渲染**: 使用 Three.js 的 PBR 材质渲染服装
- **WebGPU 加速**: 支持 WebGPU 时启用硬件加速渲染
- **骨骼动画**: 4D 效果（随时间变化的动态效果）
- **多角度查看**: 鼠标拖拽旋转，滚轮缩放
- **光照调节**: 可调节环境光强度

#### 4.3 生成结果管理
- **历史记录**: 保存每次生成的记录
- **收藏夹**: 喜欢的设计可以收藏
- **下载分享**: 支持 PNG/GIF 格式导出，生成分享链接

### 交互细节

| 动作 | 反馈 |
|------|------|
| 输入描述 | 实时文字云/标签补全建议 |
| 点击生成 | 按钮变为加载状态 + AI 生成动画 |
| 3D 模型加载 | 骨架动画过渡到完整模型 |
| 悬停服装卡片 | 卡片微微上浮 + 光晕效果 |
| AI 处理中 | 进度环 + 粒子扩散动画 |
| 生成完成 | 卡片弹入动画 + 音效提示（可选）|

### 错误处理
- **网络错误**: 显示重试按钮 + 缓存结果提示
- **ComfyUI 不可用**: 降级到预设服装库 + 提示服务暂时不可用
- **WebGPU 不支持**: 自动回退到 WebGL 渲染
- **生成超时**: 60秒超时，提示用户重试

## 5. Component Inventory

### 5.1 Header
- Logo (SVG 动画)
- Navigation links (hover 下划线动画)
- AI 助手按钮 (脉冲动画)
- 用户头像/登录入口

### 5.2 3D Model Viewer
- Canvas 容器 (全屏或固定高度)
- 控制按钮组：重置视角、切换视角、调节光照
- 加载状态：骨架屏 + 进度百分比
- 错误状态：提示信息 + 重试按钮

### 5.3 AI Prompt Input
- Textarea 区域 (placeholder 动画)
- 风格预设标签 (pill 样式，可多选)
- 颜色选择器 (圆形色块)
- 生成按钮 (gradient 背景 + 加载状态)

### 5.4 Style Preset Cards
- 图像缩略图
- 风格名称
- 悬停：放大 + 显示"Use this style"按钮

### 5.5 Generated Result Card
- 生成的图像
- 风格标签
- 操作按钮组：收藏、下载、分享、再编辑
- 悬停：显示详细参数

### 5.6 Loading States
- Skeleton loader (服装卡片形状)
- Spinner (自定义 AI 图标)
- Progress bar (渐变填充)
- Particle animation (生成中)

## 6. Technical Approach

### 技术栈

#### 前端
- **Framework**: Next.js 14 (App Router)
- **3D Rendering**: Three.js + React Three Fiber + Drei
- **WebGPU**: @react-three/drei 的 WebGPU 支持 + 降级到 WebGL
- **Styling**: Tailwind CSS + CSS Modules
- **Animation**: Framer Motion
- **State**: Zustand

#### 后端
- **API**: Next.js API Routes
- **AI 生成**: ComfyUI (外部服务或嵌入式)
- **图像处理**: Sharp (用于生成缩略图)

### API 设计

#### POST /api/generate
```typescript
// Request
{
  prompt: string;
  style?: string;
  colors?: string[];
  bodyParams?: {
    height: number;
    bust: number;
    waist: number;
    hips: number;
  };
  modelType?: "male" | "female" | "neutral";
}

// Response
{
  success: boolean;
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  images?: string[];
  error?: string;
}
```

#### GET /api/generate/[jobId]
```typescript
// Response
{
  status: "processing" | "completed" | "failed";
  images?: string[];
  progress?: number;
  error?: string;
}
```

### ComfyUI 集成

#### Workflow 设计
1. **服装生成工作流**: 从文本/图像生成服装设计
2. **虚拟试穿工作流**: 将服装"穿"到虚拟模特上
3. **风格迁移工作流**: 将参考风格应用到服装上

#### API 调用
- 使用 ComfyUI 的 API 端点触发工作流
- WebSocket 或轮询获取生成进度
- 返回生成的图像 URL

### 数据模型

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bodyParams?: BodyParams;
  preferences?: UserPreferences;
}

interface GenerationJob {
  id: string;
  userId: string;
  prompt: string;
  style: string;
  status: JobStatus;
  images: string[];
  createdAt: Date;
}

interface SavedOutfit {
  id: string;
  userId: string;
  name: string;
  images: string[];
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
}
```

### Vercel 部署配置

```javascript
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["hkg1", "sin1"], // 亚太地区
  "env": {
    "COMFYUI_API_URL": "@comfyui-api-url",
    "COMFYUI_API_KEY": "@comfyui-api-key"
  }
}
```

### 环境变量
```
COMFYUI_API_URL=https://your-comfyui-server.com
COMFYUI_API_KEY=your_api_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 7. 实施计划

### Phase 1: 基础架构 (Day 1)
- [ ] 初始化 Next.js 项目
- [ ] 配置 Tailwind CSS 和主题
- [ ] 设置项目目录结构
- [ ] 配置环境变量

### Phase 2: 前端界面 (Day 1-2)
- [ ] 实现 Header 和导航
- [ ] 创建 3D Viewer 组件
- [ ] 实现 AI Prompt 输入界面
- [ ] 风格预设组件
- [ ] 结果展示组件

### Phase 3: 3D/4D 渲染 (Day 2-3)
- [ ] 集成 Three.js + React Three Fiber
- [ ] 实现 WebGPU 降级逻辑
- [ ] 创建虚拟模特模型
- [ ] 实现服装渲染逻辑
- [ ] 添加动画效果

### Phase 4: 后端集成 (Day 3-4)
- [ ] 设置 ComfyUI API 客户端
- [ ] 实现 /api/generate 端点
- [ ] 实现轮询机制
- [ ] 处理错误和超时

### Phase 5: 部署和优化 (Day 4-5)
- [ ] Vercel 部署配置
- [ ] 性能优化
- [ ] SEO 优化
- [ ] 移动端适配
