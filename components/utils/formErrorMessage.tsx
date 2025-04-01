export default function FormErrorMessage({ msg }: { msg?: string }) {
  return <p className="text-red-500 py-1 px-2 w-fit bg-red-100 rounded-md mt-4">{msg}</p>
}