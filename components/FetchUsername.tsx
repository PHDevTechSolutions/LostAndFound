// fetchUserName.tsx

export const FetchUsername = async (userId: string, setUserName: React.Dispatch<React.SetStateAction<string>>) => {
    if (userId) {
        try {
            const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
            const data = await response.json();
            setUserName(data.name || "");
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }
};
