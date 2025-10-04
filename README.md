# Transformik AI Website - Content Management Guide

This guide explains how to update and manage content for the Transformik AI website, including tools and blogs.

## 📊 Database Structure

The website uses Supabase as the database with a two-table structure for both tools and blogs:

### Tools Structure

#### 1. `tools_summary` Table

Contains basic information displayed on the tools listing page and cards.

| Column                 | Type       | Description                                         | Required |
| ---------------------- | ---------- | --------------------------------------------------- | -------- |
| `id`                   | UUID       | Primary key, auto-generated                         | ✅       |
| `tool_name`            | Text       | Name of the AI tool                                 | ✅       |
| `slug`                 | Text       | URL-friendly version of tool name (e.g., "chatgpt") | ✅       |
| `one_line_description` | Text       | Brief description shown on cards                    | ✅       |
| `pricing_model`        | Text       | "Free", "Freemium", "Free Trial", "Premium"         | ✅       |
| `url`                  | Text       | Official website URL of the tool                    | ❌       |
| `category`             | Array/Text | Tool categories (e.g., ["AI & ML", "Writing"])      | ❌       |
| `logo`                 | Text       | Logo filename (stored in Supabase Storage)          | ❌       |
| `created_at`           | Timestamp  | Auto-generated creation date                        | ✅       |

#### 2. `tools_details` Table

Contains detailed information for individual tool pages.

| Column        | Type  | Description                               | Required |
| ------------- | ----- | ----------------------------------------- | -------- |
| `id`          | UUID  | Foreign key linking to `tools_summary.id` | ✅       |
| `description` | Text  | Detailed tool description                 | ❌       |
| `how_to_use`  | Text  | Step-by-step usage instructions           | ❌       |
| `use_cases`   | Text  | List of use cases (newline separated)     | ❌       |
| `pros`        | Text  | Tool advantages (newline separated)       | ❌       |
| `cons`        | Text  | Tool disadvantages (newline separated)    | ❌       |
| `pricing`     | Text  | Detailed pricing information              | ❌       |
| `screenshots` | Array | Screenshot filenames array                | ❌       |
| `faqs`        | JSON  | Array of {question, answer} objects       | ❌       |

### Blogs Structure

#### 1. `blogs_summary` Table

Contains basic blog information for the blog listing page.

| Column       | Type      | Description                                   | Required |
| ------------ | --------- | --------------------------------------------- | -------- |
| `id`         | UUID      | Primary key, auto-generated                   | ✅       |
| `title`      | Text      | Blog post title                               | ✅       |
| `slug`       | Text      | URL-friendly version (e.g., "ai-trends-2024") | ✅       |
| `excerpt`    | Text      | Brief summary shown on blog cards             | ✅       |
| `image`      | Text      | Featured image filename                       | ❌       |
| `author`     | Text      | Author name (defaults to "Harsh Mistry")      | ❌       |
| `created_at` | Timestamp | Auto-generated creation date                  | ✅       |

#### 2. `blogs_details` Table

Contains full blog content for individual blog pages.

| Column    | Type | Description                               | Required |
| --------- | ---- | ----------------------------------------- | -------- |
| `id`      | UUID | Foreign key linking to `blogs_summary.id` | ✅       |
| `content` | Text | Full HTML content of the blog post        | ✅       |

## 🔄 How to Add/Update Content

### Adding a New Tool

#### Step 1: Add to `tools_summary`

```sql
INSERT INTO tools_summary (
  tool_name,
  slug,
  one_line_description,
  pricing_model,
  url,
  category,
  logo
) VALUES (
  'ChatGPT',
  'chatgpt',
  'AI-powered conversational assistant',
  'Freemium',
  'https://chat.openai.com',
  ARRAY['AI & ML', 'Writing'],
  'chatgpt-logo.png'
);
```

#### Step 2: Add to `tools_details`

```sql
INSERT INTO tools_details (
  id,
  description,
  how_to_use,
  use_cases,
  pros,
  cons,
  pricing,
  screenshots,
  faqs
) VALUES (
  'uuid-from-tools-summary',
  'Detailed description of the tool...',
  'Step 1: Sign up for an account
Step 2: Navigate to the chat interface
Step 3: Type your question',
  'Content creation
Code assistance
Customer support',
  'Easy to use
High-quality responses
Multiple languages',
  'Rate limits
Requires internet',
  'Free tier: 20 queries/month
Pro: $20/month unlimited',
  ARRAY['screenshot1.png', 'screenshot2.png'],
  '[
    {"question": "Is it free?", "answer": "Yes, with limitations"},
    {"question": "How accurate is it?", "answer": "Very accurate for most tasks"}
  ]'::jsonb
);
```

### Adding a New Blog Post

#### Step 1: Add to `blogs_summary`

```sql
INSERT INTO blogs_summary (
  title,
  slug,
  excerpt,
  image,
  author
) VALUES (
  'The Future of AI in 2024',
  'future-of-ai-2024',
  'Exploring the latest trends and predictions for artificial intelligence...',
  'ai-future-2024.jpg',
  'Harsh Mistry'
);
```

#### Step 2: Add to `blogs_details`

```sql
INSERT INTO blogs_details (
  id,
  content
) VALUES (
  'uuid-from-blogs-summary',
  '<h2>Introduction</h2>
  <p>The artificial intelligence landscape is evolving rapidly...</p>
  <h2>Key Trends</h2>
  <ul>
    <li>Generative AI adoption</li>
    <li>Edge computing integration</li>
  </ul>'
);
```

## 📁 File Storage Structure

### Supabase Storage Buckets

#### `Images` Bucket

```
Images/
├── ToolLogos/
│   ├── chatgpt-logo.png
│   ├── midjourney-logo.png
│   └── ...
├── ToolScreenshot/
│   ├── chatgpt-screenshot1.png
│   ├── chatgpt-screenshot2.png
│   └── ...
└── BlogImages/
    ├── ai-future-2024.jpg
    ├── ml-trends.png
    └── ...
```

## 🛠️ Content Management Best Practices

### Tool Management

1. **Slugs**: Always use lowercase, hyphen-separated slugs (e.g., `google-bard` not `Google Bard`)

2. **Categories**: Use consistent category names:

   - "AI & ML"
   - "Writing & Editing"
   - "Technology"
   - "Business"
   - "Marketing"
   - "Education"
   - "Health & Wellness"

3. **Pricing Models**: Use exact values:

   - "Free"
   - "Freemium"
   - "Free Trial"
   - "Premium"

4. **Images**:
   - Logos: 200x200px PNG with transparent background
   - Screenshots: 1200px wide, maintain aspect ratio
   - Use descriptive filenames

### Blog Management

1. **Slugs**: Use SEO-friendly slugs (e.g., `best-ai-tools-2024`)

2. **Content**:

   - Use proper HTML formatting
   - Include headings (h2, h3) for structure
   - Add images with alt text
   - Keep paragraphs concise

3. **Excerpts**:
   - 150-200 characters
   - End with "..." if truncated
   - Compelling and informative

## 🔍 Common Queries

### Get All Tools by Category

```sql
SELECT * FROM tools_summary
WHERE category @> ARRAY['AI & ML']
ORDER BY tool_name;
```

### Get Recent Blog Posts

```sql
SELECT * FROM blogs_summary
ORDER BY created_at DESC
LIMIT 10;
```

### Update Tool Pricing

```sql
UPDATE tools_summary
SET pricing_model = 'Premium'
WHERE slug = 'chatgpt';
```

### Get Full Blog Post

```sql
SELECT
  bs.*,
  bd.content
FROM blogs_summary bs
JOIN blogs_details bd ON bs.id = bd.id
WHERE bs.slug = 'future-of-ai-2024';
```

## 🚨 Important Notes

1. **Always maintain the relationship** between summary and details tables using the same `id`

2. **Test slugs** to ensure they're unique and URL-friendly

3. **Optimize images** before uploading to reduce load times

4. **Backup data** before making bulk changes

5. **Use transactions** when inserting related records:

```sql
BEGIN;
INSERT INTO tools_summary (...) RETURNING id;
INSERT INTO tools_details (id, ...) VALUES ('returned-id', ...);
COMMIT;
```

## 📱 Frontend Integration

The website automatically:

- Fetches data from these tables
- Generates SEO-friendly URLs
- Handles image loading from Supabase Storage
- Provides search and filtering functionality
- Manages pagination

No additional configuration needed after adding content to the database!

---

For technical issues or questions, contact the development team.

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
