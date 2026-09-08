# image-upload-handler-for-supabase-and-nextjs

A simple reusable image upload component and handler for supabase and nextjs with drag and drop and keyboard accessibility features.

> NOTE: all 4 demo videos in _Examples_ are from a web app I worked on so you can see all features (more in that in the _Notes on Usage_ section below). the video below is what you actually will see

https://github.com/user-attachments/assets/95f5a1f8-ee74-4e93-80a0-93dcf6e0683f

Supported stacks:

- Supabase with Nextjs, Tailwind, shadcn/ui, React Hook Form and Zod

See the [Examples](#-examples) section below for more demos.

## Getting Started

Currently this project works for Nextjs and supabase but I believe it will work fine with React too with simple modifications.

```bash
git clone https://github.com/theeyad/image-upload-handler-for-supabase-and-nextjs.git
cd image-upload-handler-for-supabase-and-nextjs
npm install
npm run dev
```

Now let's take a look at this

```text
image-upload-handler-for-supabase-and-nextjs/
├── src/
│   ├── actions/
│   │   └── admin.ts                # Server action to create category and add it to Supabase
│   ├── app/                        # Next.js App Router layout, page & global CSS
│   ├── components/
│   │   ├── shared/
│   │   │   ├── ImageUploader.tsx   # The main UI component
│   │   │   └── NewCategoryForm.tsx # Full Form Demo Component
│   │   └── ui/                     # shadcn/ui components (button, field, label, toast, etc.)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client helper
│   │   │   └── server.ts           # Server Supabase client helper
│   │   ├── validation/
│   │   │   └── categories/
│   │   │       └── createCat.ts    # Zod schema
│   │   ├── upload.ts               # Storage upload helper function
│   │   └── utils.ts                # cn() & generateUniqueId() helpers
│   └── supabase/
│       └── storage-policies.sql    # Storage bucket & RLS SQL setup script
├── next.config.ts                  # remotePatterns config example
└── README.md                       # Full documentation & RHF + Zod examples
```

Here we have the simplest implementation of our image upload handler, in `src/components/shared/NewCategoryForm.tsx` you will find a full form using shadcn/ui and our `ImageUploader.tsx`

## Examples

**Normal Upload**

https://github.com/user-attachments/assets/1e75f752-14d7-4853-80cd-1a7b16f5880f

**Drag & Drop**

https://github.com/user-attachments/assets/b6fb9d68-7a60-4d30-87e8-5afd4baa1745

**Keyboard Accessibility**

https://github.com/user-attachments/assets/b48be578-3cfa-46f0-ab5a-898636f96f23

## Notes on Usage

> This demo will not function untill `.env.example` is provided with real values. and supabase storage bucket is created and RLS policies are enabled on that bucket.

Follow these steps:

1. first you need a storage bucket in supabase and RLS policies enabled on that bucket.

2. then you can use the `ImageUploader.tsx` component in your project with the props: `value`, `onChange`, `onError`, `bucket`, `folder`, `disabled`. those props are connected to react hook form (RHF) and supabase bucket.

3. `ImageUploader.tsx` uses the `upload.ts` helper function to upload images to supabase.

4. the `createCat.ts` schema is used in `NewCategoryForm.tsx` to validate images.

5. `admin.ts` server action is used to create categories and add them to supabase.

6. `generateUniqueId()` helper function is used to generate unique ids.

7. `app/page.tsx` uses `NewCategoryForm.tsx` component to display a full form using shadcn/ui and our `ImageUploader.tsx`.

8. `next.config.ts` remotePatterns config example to configure remote patterns for images, this is needed for next `<Image>` component so it can display the preview of uploaded image.

> To use the `ImageUploader` component and understand the whole flow see [Full Documentation](Documentation.md).

## License

MIT License — Feel free to use, modify, and distribute in your own projects!
