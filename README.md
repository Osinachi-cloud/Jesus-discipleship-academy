# Jesus Discipleship Academy CMS

A modern Content Management System for Christian content and discipleship materials built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## Features

### Public Website
- Modern, responsive design
- Homepage with hero section and latest posts
- Posts listing with category filtering and pagination
- Individual post pages with comments
- Media library (Books/PDFs, Videos, Images)
- Category pages

### Admin Dashboard
- Secure authentication with NextAuth.js
- Dashboard with statistics overview
- Posts management (Create, Edit, Delete, Publish)
- Rich text editor (Tiptap)
- Media library management with file uploads
- Comments moderation
- Categories management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with credentials
- **Rich Text Editor**: Tiptap
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd jesus-discipleship-academy
npm install
```

2. Set up the database:
```bash
npx prisma db push
```

3. Seed the database with initial data:
```bash
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Credentials

- **Email**: admin@discipleship.org
- **Password**: admin123

## Project Structure

```
jesus-discipleship-academy/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
├── public/
│   └── uploads/           # Media uploads
├── src/
│   ├── app/
│   │   ├── (public)/      # Public pages
│   │   ├── admin/         # Admin dashboard
│   │   └── api/           # API routes
│   ├── components/
│   │   ├── admin/         # Admin components
│   │   ├── public/        # Public components
│   │   └── ui/            # UI components
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
├── .env.local             # Environment variables
└── package.json
```

## Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## API Routes

- `GET/POST /api/posts` - List/create posts
- `GET/PUT/DELETE /api/posts/[id]` - Single post operations
- `GET /api/posts/slug/[slug]` - Get post by slug
- `GET/POST /api/comments` - List/create comments
- `DELETE /api/comments/[id]` - Delete comment
- `GET/POST /api/media` - List/create media
- `POST /api/media/upload` - Upload files
- `DELETE /api/media/[id]` - Delete media
- `GET/POST /api/categories` - List/create categories
- `PUT/DELETE /api/categories/[id]` - Update/delete category
- `GET /api/stats` - Dashboard statistics

## Development

```bash
# Run development server
npm run dev

# Open Prisma Studio
npm run db:studio

# Push schema changes
npm run db:push

# Seed database
npm run db:seed
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

For production, consider:
- Using PostgreSQL instead of SQLite
- Using cloud storage (S3, Cloudinary) for media
- Setting secure NEXTAUTH_SECRET
- Configuring proper NEXTAUTH_URL

## License

MIT
