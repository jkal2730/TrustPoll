import VoteInputForm from "@/components/VoteInputForm";

export default function Vote() {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Welcome to TrustPoll
                    </h2>
                    <p className="text-lg text-gray-600 mb-4">
                        Your vote, protected and valued.
                    </p>
                    <VoteInputForm />
                </div>
            </main>
            
        </div>
    );
}