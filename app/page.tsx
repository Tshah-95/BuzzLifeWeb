import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-lg font-bold">Welcome to Next.js!</h1>
      <p className="text-md">
        Get started by editing <code>pages/index.js</code>
      </p>
      <div className="flex flex-col items-center">
        <Image src="/vercel.svg" alt="Vercel Logo" width={300} height={100} />
        <Image src="/next.svg" alt="Next.js Logo" width={300} height={100} />
      </div>
    </main>
  );
}
