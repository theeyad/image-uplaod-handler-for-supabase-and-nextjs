import NewCategoryForm from "@/components/shared/NewCategoryForm";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <NewCategoryForm />
    </div>
  );
}
