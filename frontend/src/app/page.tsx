import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1 className="text-5xl md:text-7xl font-extrabold text-blue-600 mb-5 text-center">
        TrustPoll
      </h1>

      <h2 className="text-lg text-gray-500 mb-5 text-center">
        A reliable voting system based on Ethereum smart contract.
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <Link href="/create" passHref>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-md hover:bg-blue-700 transition text-lg font-medium">
            Create
          </button>
        </Link>
        <Link href="/register" passHref>
          <button className="bg-blue-400 text-white px-8 py-4 rounded-2xl shadow-md hover:bg-blue-500 transition text-lg font-medium">
            Register
          </button>
        </Link>

        <Link href="/vote" passHref>
          <button className="bg-gray-100 text-blue-600 px-8 py-4 rounded-2xl shadow-md hover:bg-gray-200 transition text-lg font-medium border border-blue-600">
            Vote
          </button>
        </Link>
      </div>
    </main>
  );
}
