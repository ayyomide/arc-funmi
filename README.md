# Arcfunmi - Where Built World Shares Ideas

Arcfunmi is a modern social website built for architects, engineers, and construction professionals to share knowledge, read blogs, and engage with the built world community.

## 🌟 Features

- **Modern Landing Page**: Beautiful, responsive design with gradient backgrounds and smooth animations
- **Knowledge Hub**: Platform for sharing and reading professional insights
- **User Authentication**: Sign in/sign up functionality (coming soon)
- **Content Categories**: Organized topics for Architecture, Engineering, and Construction
- **Newsletter Subscription**: Stay updated with the latest content
- **Responsive Design**: Optimized for all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Lucide React
- **Font**: Outfit (Google Fonts with Next.js optimization)
- **Build Tool**: Turbopack

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Arc_Funmi
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
Arc_Funmi/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with Outfit font
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── layout/           # Layout components
│   │   ├── Header.tsx    # Navigation header with logo
│   │   └── Footer.tsx    # Site footer
│   └── sections/         # Page sections
│       ├── HeroSection.tsx
│       ├── WhyArcFunmi.tsx
│       ├── HotTopics.tsx
│       ├── CallToAction.tsx
│       └── Newsletter.tsx
├── public/               # Static assets
│   └── assets/          # Organized asset structure
│       ├── images/      # JPG/PNG images
│       │   ├── hero-bg.jpg
│       │   └── article-*.jpg
│       └── svgs/        # SVG files
│           └── logo.svg # Arcfunmi logo
└── tailwind.config.ts   # Tailwind configuration
```

## 🎨 Design Features

- **Typography**: Outfit Google Font optimized with Next.js font system
- **Color Scheme**: Orange and yellow gradients with black backgrounds
- **Logo**: Custom SVG logo with modern arc design
- **Images**: Organized asset structure in `/public/assets/`
- **Responsive**: Mobile-first design with breakpoints
- **Animations**: Hover effects and smooth transitions
- **Accessibility**: Semantic HTML and proper ARIA labels

## 🖼️ Assets Organization

All static assets are organized in the `/public/assets/` directory:

- **Images**: `/public/assets/images/` - Hero backgrounds and article images
- **SVGs**: `/public/assets/svgs/` - Logo and vector graphics

## 🔮 Coming Soon

- User authentication system
- Blog post creation and editing
- User profiles and dashboards
- Comment system
- Search functionality
- Content filtering and tags

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS v4 for styling
- Next.js font optimization
- Component-based architecture

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
