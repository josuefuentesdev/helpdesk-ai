import { CreateAssetForm } from "@/components/asset-form/create-asset-form"

export default async function NewAssetPage() {
  return (
    <div className="max-w-2xl px-6 py-8">
      <CreateAssetForm />
    </div>
  )
}